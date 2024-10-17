import { Construct } from "constructs";
import { CustomResource } from "aws-cdk-lib/core";
import { Effect, Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { HostedZone, ARecord, AaaaRecord, RecordTarget, } from "aws-cdk-lib/aws-route53";
import { Distribution as CdkDistribution, } from "aws-cdk-lib/aws-cloudfront";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Stack } from "./Stack.js";
import { isCDKConstruct } from "./Construct.js";
import { HttpsRedirect } from "./cdk/website-redirect.js";
import { DnsValidatedCertificate } from "./cdk/dns-validated-certificate.js";
import { VisibleError } from "../error.js";
export class Distribution extends Construct {
    scope;
    props;
    distribution;
    hostedZone;
    certificate;
    constructor(scope, id, props) {
        super(scope, id);
        // Override scope
        // note: this is intended to be used internally by SST to make constructs
        //       backwards compatible when the hirechical structure of the constructs
        //       changes. When the hirerchical structure changes, the child AWS
        //       resources' logical ID will change. And CloudFormation will recreate
        //       them.
        this.scope = props.scopeOverride || this;
        this.props = props;
        const isImportedCloudFrontDistribution = (distribution) => {
            return distribution !== undefined && isCDKConstruct(distribution);
        };
        // cdk.distribution is an imported construct
        if (isImportedCloudFrontDistribution(props.cdk?.distribution)) {
            this.distribution = props.cdk?.distribution;
            return;
        }
        this.validateCustomDomainSettings();
        this.validateCloudFrontDistributionSettings();
        this.hostedZone = this.lookupHostedZone();
        this.certificate = this.createCertificate();
        this.distribution = this.createDistribution();
        this.createRoute53Records();
    }
    /**
     * The CloudFront URL of the website.
     */
    get url() {
        return `https://${this.distribution.distributionDomainName}`;
    }
    /**
     * If the custom domain is enabled, this is the URL of the website with the
     * custom domain.
     */
    get customDomainUrl() {
        const { customDomain } = this.props;
        if (!customDomain)
            return;
        if (typeof customDomain === "string") {
            return `https://${customDomain}`;
        }
        else {
            return `https://${customDomain.domainName}`;
        }
    }
    /**
     * The internally created CDK resources.
     */
    get cdk() {
        return {
            distribution: this.distribution,
            hostedZone: this.hostedZone,
            certificate: this.certificate,
        };
    }
    createInvalidation(props) {
        const { version, paths, wait, dependsOn } = props ?? {};
        const stack = Stack.of(this);
        const policy = new Policy(this.scope, "CloudFrontInvalidatorPolicy", {
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        "cloudfront:GetInvalidation",
                        "cloudfront:CreateInvalidation",
                    ],
                    resources: [
                        `arn:${stack.partition}:cloudfront::${stack.account}:distribution/${this.distribution.distributionId}`,
                    ],
                }),
            ],
        });
        stack.customResourceHandler.role?.attachInlinePolicy(policy);
        const resource = new CustomResource(this.scope, "CloudFrontInvalidator", {
            serviceToken: stack.customResourceHandler.functionArn,
            resourceType: "Custom::CloudFrontInvalidator",
            properties: {
                version: version ||
                    Date.now().toString(16) + Math.random().toString(16).slice(2),
                distributionId: this.distribution.distributionId,
                paths: [...new Set(paths ?? ["/*"])],
                wait: wait ?? false,
            },
        });
        resource.node.addDependency(policy);
        dependsOn?.forEach((c) => resource.node.addDependency(c));
        return resource;
    }
    validateCloudFrontDistributionSettings() {
        const { cdk } = this.props;
        if (!cdk?.distribution)
            return;
        if (cdk.distribution.certificate) {
            throw new VisibleError(`Do not configure the "cfDistribution.certificate". Use the "customDomain" to configure the domain certificate.`);
        }
        if (cdk.distribution.domainNames) {
            throw new VisibleError(`Do not configure the "cfDistribution.domainNames". Use the "customDomain" to configure the domain name.`);
        }
    }
    validateCustomDomainSettings() {
        const { customDomain } = this.props;
        if (!customDomain) {
            return;
        }
        if (typeof customDomain === "string") {
            return;
        }
        if (!customDomain.domainName) {
            throw new VisibleError(`Missing "domainName" for customDomain.`);
        }
        if (customDomain.isExternalDomain === true) {
            if (!customDomain.cdk?.certificate) {
                throw new VisibleError(`A valid certificate is required when "isExternalDomain" is set to "true".`);
            }
            if (customDomain.domainAlias) {
                throw new VisibleError(`Domain alias is only supported for domains hosted on Amazon Route 53. Do not set the "customDomain.domainAlias" when "isExternalDomain" is enabled.`);
            }
            if (customDomain.hostedZone) {
                throw new VisibleError(`Hosted zones can only be configured for domains hosted on Amazon Route 53. Do not set the "customDomain.hostedZone" when "isExternalDomain" is enabled.`);
            }
        }
    }
    lookupHostedZone() {
        const { customDomain } = this.props;
        // Skip if customDomain is not configured
        if (!customDomain) {
            return;
        }
        let hostedZone;
        if (typeof customDomain === "string") {
            hostedZone = HostedZone.fromLookup(this.scope, "HostedZone", {
                domainName: customDomain,
            });
        }
        else if (customDomain.cdk?.hostedZone) {
            hostedZone = customDomain.cdk.hostedZone;
        }
        else if (typeof customDomain.hostedZone === "string") {
            hostedZone = HostedZone.fromLookup(this.scope, "HostedZone", {
                domainName: customDomain.hostedZone,
            });
        }
        else if (typeof customDomain.domainName === "string") {
            // Skip if domain is not a Route53 domain
            if (customDomain.isExternalDomain === true) {
                return;
            }
            hostedZone = HostedZone.fromLookup(this.scope, "HostedZone", {
                domainName: customDomain.domainName,
            });
        }
        else {
            hostedZone = customDomain.hostedZone;
        }
        return hostedZone;
    }
    createCertificate() {
        const { customDomain } = this.props;
        if (!customDomain) {
            return;
        }
        let acmCertificate;
        // HostedZone is set for Route 53 domains
        if (this.hostedZone) {
            if (typeof customDomain === "string") {
                acmCertificate = new DnsValidatedCertificate(this.scope, "Certificate", {
                    domainName: customDomain,
                    hostedZone: this.hostedZone,
                    region: "us-east-1",
                });
            }
            else if (customDomain.cdk?.certificate) {
                acmCertificate = customDomain.cdk.certificate;
            }
            else {
                acmCertificate = new DnsValidatedCertificate(this.scope, "Certificate", {
                    domainName: customDomain.domainName,
                    hostedZone: this.hostedZone,
                    region: "us-east-1",
                });
            }
        }
        // HostedZone is NOT set for non-Route 53 domains
        else {
            if (typeof customDomain !== "string") {
                acmCertificate = customDomain.cdk?.certificate;
            }
        }
        return acmCertificate;
    }
    createDistribution() {
        const { cdk } = this.props;
        return new CdkDistribution(this.scope, "Distribution", {
            ...cdk?.distribution,
            domainNames: this.buildDistributionDomainNames(),
            certificate: this.certificate,
        });
    }
    buildDistributionDomainNames() {
        const { customDomain } = this.props;
        const domainNames = [];
        if (!customDomain) {
            // no domain
        }
        else if (typeof customDomain === "string") {
            domainNames.push(customDomain);
        }
        else {
            domainNames.push(customDomain.domainName);
            if (customDomain.alternateNames) {
                if (!customDomain.cdk?.certificate)
                    throw new VisibleError("Certificates for alternate domains cannot be automatically created. Please specify certificate to use");
                domainNames.push(...customDomain.alternateNames);
            }
        }
        return domainNames;
    }
    createRoute53Records() {
        const { customDomain } = this.props;
        if (!customDomain || !this.hostedZone) {
            return;
        }
        let recordName;
        let domainAlias;
        if (typeof customDomain === "string") {
            recordName = customDomain;
        }
        else {
            recordName = customDomain.domainName;
            domainAlias = customDomain.domainAlias;
        }
        // Create DNS record
        const recordProps = {
            recordName,
            zone: this.hostedZone,
            target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
        };
        new ARecord(this.scope, "AliasRecord", recordProps);
        new AaaaRecord(this.scope, "AliasRecordAAAA", recordProps);
        // Create Alias redirect record
        if (domainAlias) {
            new HttpsRedirect(this.scope, "Redirect", {
                zone: this.hostedZone,
                recordNames: [domainAlias],
                targetDomain: recordName,
            });
        }
    }
}
