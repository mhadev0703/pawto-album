import { Construct, IConstruct } from "constructs";
import { CustomResource } from "aws-cdk-lib/core";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { DistributionProps as CdkDistributionProps, IDistribution } from "aws-cdk-lib/aws-cloudfront";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
/**
 * The customDomain for this website. SST supports domains that are hosted either on [Route 53](https://aws.amazon.com/route53/) or externally.
 *
 * Note that you can also migrate externally hosted domains to Route 53 by [following this guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html).
 *
 * @example
 * ```js
 * new StaticSite(this, "Site", {
 *   path: "path/to/src",
 *   customDomain: "domain.com",
 * });
 * ```
 *
 * @example
 * ```js
 * new StaticSite(this, "Site", {
 *   path: "path/to/src",
 *   customDomain: {
 *     domainName: "domain.com",
 *     domainAlias: "www.domain.com",
 *     hostedZone: "domain.com",
 *   }
 * });
 * ```
 */
export interface DistributionDomainProps {
    /**
     * The domain to be assigned to the website URL (ie. domain.com).
     *
     * Supports domains that are hosted either on [Route 53](https://aws.amazon.com/route53/) or externally.
     */
    domainName: string;
    /**
     * An alternative domain to be assigned to the website URL. Visitors to the alias will be redirected to the main domain. (ie. `www.domain.com`).
     *
     * Use this to create a `www.` version of your domain and redirect visitors to the root domain.
     * @default no alias configured
     */
    domainAlias?: string;
    /**
     * The hosted zone in Route 53 that contains the domain. By default, SST will look for a hosted zone matching the domainName that's passed in.
     *
     * Set this option if SST cannot find the hosted zone in Route 53.
     * @default same as the `domainName`
     */
    hostedZone?: string;
    /**
     * Specify additional names that should route to the Cloudfront Distribution. Note, certificates for these names will not be automatically generated so the `certificate` option must be specified.
     * @default `[]`
     */
    alternateNames?: string[];
    /**
     * Set this option if the domain is not hosted on Amazon Route 53.
     * @default `false`
     */
    isExternalDomain?: boolean;
    cdk?: {
        /**
         * Import the underlying Route 53 hosted zone.
         */
        hostedZone?: IHostedZone;
        /**
         * Import the certificate for the domain. By default, SST will create a certificate with the domain name. The certificate will be created in the `us-east-1`(N. Virginia) region as required by AWS CloudFront.
         *
         * Set this option if you have an existing certificate in the `us-east-1` region in AWS Certificate Manager you want to use.
         */
        certificate?: ICertificate;
    };
}
export interface DistributionProps {
    /**
     * The customDomain for this website. SST supports domains that are hosted
     * either on [Route 53](https://aws.amazon.com/route53/) or externally.
     *
     * Note that you can also migrate externally hosted domains to Route 53 by
     * [following this guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html).
     *
     * @example
     * ```js
     * customDomain: "domain.com",
     * ```
     *
     * ```js
     * customDomain: {
     *   domainName: "domain.com",
     *   domainAlias: "www.domain.com",
     *   hostedZone: "domain.com"
     * },
     * ```
     */
    customDomain?: string | DistributionDomainProps;
    scopeOverride?: IConstruct;
    cdk: {
        distribution: CdkDistributionProps | IDistribution;
    };
}
export declare class Distribution extends Construct {
    private scope;
    private props;
    private distribution;
    private hostedZone?;
    private certificate?;
    constructor(scope: Construct, id: string, props: DistributionProps);
    /**
     * The CloudFront URL of the website.
     */
    get url(): string;
    /**
     * If the custom domain is enabled, this is the URL of the website with the
     * custom domain.
     */
    get customDomainUrl(): string | undefined;
    /**
     * The internally created CDK resources.
     */
    get cdk(): {
        distribution: IDistribution;
        hostedZone: IHostedZone | undefined;
        certificate: ICertificate | undefined;
    };
    createInvalidation(props?: {
        version?: string;
        paths?: string[];
        wait?: boolean;
        dependsOn?: IConstruct[];
    }): CustomResource;
    private validateCloudFrontDistributionSettings;
    private validateCustomDomainSettings;
    private lookupHostedZone;
    private createCertificate;
    private createDistribution;
    private buildDistributionDomainNames;
    private createRoute53Records;
}
