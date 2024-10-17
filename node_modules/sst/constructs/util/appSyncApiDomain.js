import { Token } from "aws-cdk-lib/core";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { Stack } from "../Stack.js";
import { DnsValidatedCertificate } from "../cdk/dns-validated-certificate.js";
export function buildCustomDomainData(scope, customDomain) {
    if (customDomain === undefined) {
        return;
    }
    // customDomain is a string
    else if (typeof customDomain === "string") {
        return buildDataForStringInput(scope, customDomain);
    }
    // customDomain.domainName is a string
    else if (customDomain.domainName) {
        return customDomain.isExternalDomain
            ? buildDataForExternalDomainInput(scope, customDomain)
            : buildDataForInternalDomainInput(scope, customDomain);
    }
    // customDomain.domainName not exists
    throw new Error(`Missing "domainName" in sst.AppSyncApi's customDomain setting`);
}
export function cleanup(scope, domainData) {
    const cfnDomainName = getCfnDomainName(scope);
    const cfnDomainNameApiAssociation = getCfnDomainNameApiAssociation(scope);
    if (domainData.hostedZone) {
        createRecords(scope, domainData.domainName, domainData.hostedZone, domainData.recordType, cfnDomainName);
    }
    fixDomainResourceDependencies(cfnDomainName, cfnDomainNameApiAssociation);
}
function buildDataForStringInput(scope, customDomain) {
    // validate: customDomain is a TOKEN string
    // ie. imported SSM value: ssm.StringParameter.valueForStringParameter()
    if (Token.isUnresolved(customDomain)) {
        throw new Error(`You also need to specify the "hostedZone" if the "domainName" is passed in as a reference.`);
    }
    assertDomainNameIsLowerCase(customDomain);
    const domainName = customDomain;
    const hostedZoneDomain = domainName.split(".").slice(1).join(".");
    const hostedZone = lookupHostedZone(scope, hostedZoneDomain);
    const certificate = createCertificate(scope, domainName, hostedZone);
    return {
        certificate,
        domainName,
        hostedZone,
    };
}
function buildDataForInternalDomainInput(scope, customDomain) {
    // If customDomain is a TOKEN string, "hostedZone" has to be passed in. This
    // is because "hostedZone" cannot be parsed from a TOKEN value.
    if (Token.isUnresolved(customDomain.domainName)) {
        if (!customDomain.hostedZone) {
            throw new Error(`You also need to specify the "hostedZone" if the "domainName" is passed in as a reference.`);
        }
    }
    else {
        assertDomainNameIsLowerCase(customDomain.domainName);
    }
    const domainName = customDomain.domainName;
    // Lookup hosted zone
    // Note: Allow user passing in `hostedZone` object. The use case is when
    //       there are multiple HostedZones with the same domain, but one is
    //       public, and one is private.
    let hostedZone;
    if (customDomain.hostedZone) {
        const hostedZoneDomain = customDomain.hostedZone;
        hostedZone = lookupHostedZone(scope, hostedZoneDomain);
    }
    else if (customDomain.cdk?.hostedZone) {
        hostedZone = customDomain.cdk.hostedZone;
    }
    else {
        const hostedZoneDomain = domainName.split(".").slice(1).join(".");
        hostedZone = lookupHostedZone(scope, hostedZoneDomain);
    }
    // Create certificate
    // Note: Allow user passing in `certificate` object. The use case is for
    //       user to create wildcard certificate or using an imported certificate.
    const certificate = customDomain.cdk?.certificate
        ? customDomain.cdk.certificate
        : createCertificate(scope, domainName, hostedZone);
    return {
        certificate,
        domainName,
        hostedZone,
        recordType: customDomain.recordType,
    };
}
function buildDataForExternalDomainInput(_scope, customDomain) {
    // if it is external, then a certificate is required
    if (!customDomain.cdk?.certificate) {
        throw new Error(`A valid certificate is required when "isExternalDomain" is set to "true".`);
    }
    // if it is external, then the hostedZone is not required
    if (customDomain.hostedZone || customDomain.cdk?.hostedZone) {
        throw new Error(`Hosted zones can only be configured for domains hosted on Amazon Route 53. Do not set the "hostedZone" when "isExternalDomain" is enabled.`);
    }
    const domainName = customDomain.domainName;
    assertDomainNameIsLowerCase(domainName);
    const certificate = customDomain.cdk.certificate;
    return {
        certificate,
        domainName,
    };
}
function lookupHostedZone(scope, hostedZoneDomain) {
    return route53.HostedZone.fromLookup(scope, "HostedZone", {
        domainName: hostedZoneDomain,
    });
}
function createCertificate(scope, domainName, hostedZone) {
    const stack = Stack.of(scope);
    return stack.region === "us-east-1"
        ? new acm.Certificate(scope, "Certificate", {
            domainName,
            validation: acm.CertificateValidation.fromDns(hostedZone),
        })
        : new DnsValidatedCertificate(scope, "Certificate", {
            domainName,
            hostedZone,
            region: "us-east-1",
        });
}
function createRecords(scope, domainName, hostedZone, recordType, cfnDomainName) {
    // create DNS record
    const aRecordProps = {
        recordName: domainName,
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias({
            bind() {
                return {
                    hostedZoneId: route53Targets.CloudFrontTarget.CLOUDFRONT_ZONE_ID,
                    dnsName: cfnDomainName.attrAppSyncDomainName,
                };
            },
        }),
    };
    const records = (recordType || "CNAME") === "CNAME"
        ? [
            new route53.CnameRecord(scope, "CnameRecord", {
                recordName: domainName,
                zone: hostedZone,
                domainName: cfnDomainName.attrAppSyncDomainName,
            }),
        ]
        : [
            new route53.ARecord(scope, "AliasRecord", aRecordProps),
            new route53.AaaaRecord(scope, "AliasRecordAAAA", aRecordProps),
        ];
    // note: If domainName is a TOKEN string ie. ${TOKEN..}, the route53.ARecord
    //       construct will append ".${hostedZoneName}" to the end of the domain.
    //       This is because the construct tries to check if the record name
    //       ends with the domain name. If not, it will append the domain name.
    //       So, we need remove this behavior.
    if (Token.isUnresolved(domainName)) {
        records.forEach((record) => {
            const cfnRecord = record.node.defaultChild;
            cfnRecord.name = domainName;
        });
    }
}
function getCfnDomainName(scope) {
    return scope.cdk.graphqlApi.node.children.find((child) => child.cfnResourceType === "AWS::AppSync::DomainName");
}
function getCfnDomainNameApiAssociation(scope) {
    return scope.cdk.graphqlApi.node.children.find((child) => child.cfnResourceType ===
        "AWS::AppSync::DomainNameApiAssociation");
}
function fixDomainResourceDependencies(cfnDomainName, cfnDomainNameApiAssociation) {
    // note: As of CDK 2.20.0, the "AWS::AppSync::DomainNameApiAssociation" resource
    //       is not dependent on the "AWS::AppSync::DomainName" resource. This leads
    //       CloudFormation deploy error if DomainNameApiAssociation is created before
    //       DomainName is created.
    //       https://github.com/aws/aws-cdk/issues/18395#issuecomment-1099455502
    //       To workaround this issue, we need to add a dependency manually.
    if (cfnDomainName && cfnDomainNameApiAssociation) {
        cfnDomainNameApiAssociation.node.addDependency(cfnDomainName);
    }
}
function assertDomainNameIsLowerCase(domainName) {
    if (domainName !== domainName.toLowerCase()) {
        throw new Error(`The domain name needs to be in lowercase`);
    }
}
