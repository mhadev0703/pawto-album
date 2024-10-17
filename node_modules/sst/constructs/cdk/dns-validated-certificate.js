import url from "url";
import * as path from "path";
import { Token, TagManager, TagType, Duration, Stack, CustomResource, Lazy, } from "aws-cdk-lib/core";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { CertificateBase } from "./certificate-base.js";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
/**
 * A certificate managed by AWS Certificate Manager.  Will be automatically
 * validated using DNS validation against the specified Route 53 hosted zone.
 *
 * @resource AWS::CertificateManager::Certificate
 */
export class DnsValidatedCertificate extends CertificateBase {
    certificateArn;
    /**
     * Resource Tags.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-tags
     */
    tags;
    region;
    normalizedZoneName;
    hostedZoneId;
    domainName;
    _removalPolicy;
    constructor(scope, id, props) {
        super(scope, id);
        this.region = props.region;
        this.domainName = props.domainName;
        // check if domain name is 64 characters or less
        if (!Token.isUnresolved(props.domainName) && props.domainName.length > 64) {
            throw new Error("Domain name must be 64 characters or less");
        }
        this.normalizedZoneName = props.hostedZone.zoneName;
        // Remove trailing `.` from zone name
        if (this.normalizedZoneName.endsWith(".")) {
            this.normalizedZoneName = this.normalizedZoneName.substring(0, this.normalizedZoneName.length - 1);
        }
        // Remove any `/hostedzone/` prefix from the Hosted Zone ID
        this.hostedZoneId = props.hostedZone.hostedZoneId.replace(/^\/hostedzone\//, "");
        this.tags = new TagManager(TagType.MAP, "AWS::CertificateManager::Certificate");
        let certificateTransparencyLoggingPreference;
        if (props.transparencyLoggingEnabled !== undefined) {
            certificateTransparencyLoggingPreference =
                props.transparencyLoggingEnabled ? "ENABLED" : "DISABLED";
        }
        const requestorFunction = new lambda.Function(this, "CertificateRequestorFunction", {
            code: lambda.Code.fromAsset(path.join(__dirname, "../../support/certificate-requestor")),
            handler: "index.certificateRequestHandler",
            runtime: lambda.Runtime.NODEJS_18_X,
            timeout: Duration.minutes(15),
            role: props.customResourceRole,
        });
        requestorFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                "acm:RequestCertificate",
                "acm:DescribeCertificate",
                "acm:DeleteCertificate",
                "acm:AddTagsToCertificate",
            ],
            resources: ["*"],
        }));
        requestorFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ["route53:GetChange"],
            resources: ["*"],
        }));
        requestorFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ["route53:changeResourceRecordSets"],
            resources: [
                `arn:${Stack.of(requestorFunction).partition}:route53:::hostedzone/${this.hostedZoneId}`,
            ],
            conditions: {
                "ForAllValues:StringEquals": {
                    "route53:ChangeResourceRecordSetsRecordTypes": ["CNAME"],
                    "route53:ChangeResourceRecordSetsActions": props.cleanupRoute53Records ? ["UPSERT", "DELETE"] : ["UPSERT"],
                },
                "ForAllValues:StringLike": {
                    "route53:ChangeResourceRecordSetsNormalizedRecordNames": [
                        addWildcard(props.domainName),
                        ...(props.subjectAlternativeNames ?? []).map((d) => addWildcard(d)),
                    ],
                },
            },
        }));
        const certificate = new CustomResource(this, "CertificateRequestorResource", {
            serviceToken: requestorFunction.functionArn,
            properties: {
                DomainName: props.domainName,
                SubjectAlternativeNames: Lazy.list({ produce: () => props.subjectAlternativeNames }, { omitEmpty: true }),
                CertificateTransparencyLoggingPreference: certificateTransparencyLoggingPreference,
                HostedZoneId: this.hostedZoneId,
                Region: props.region,
                Route53Endpoint: props.route53Endpoint,
                RemovalPolicy: Lazy.any({ produce: () => this._removalPolicy }),
                // Custom resources properties are always converted to strings; might as well be explict here.
                CleanupRecords: props.cleanupRoute53Records ? "true" : undefined,
                Tags: Lazy.list({ produce: () => this.tags.renderTags() }),
            },
        });
        this.certificateArn = certificate.getAtt("Arn").toString();
        this.node.addValidation({
            validate: () => this.validateDnsValidatedCertificate(),
        });
    }
    applyRemovalPolicy(policy) {
        this._removalPolicy = policy;
    }
    validateDnsValidatedCertificate() {
        const errors = [];
        // Ensure the zone name is a parent zone of the certificate domain name
        if (!Token.isUnresolved(this.normalizedZoneName) &&
            this.domainName !== this.normalizedZoneName &&
            !this.domainName.endsWith("." + this.normalizedZoneName)) {
            errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for certificate domain name ${this.domainName}`);
        }
        return errors;
    }
}
// https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/specifying-rrset-conditions.html
function addWildcard(domainName) {
    if (domainName.startsWith("*.")) {
        return domainName;
    }
    return `*.${domainName}`;
}
