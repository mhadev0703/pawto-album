import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { AppSyncApi } from "../AppSyncApi.js";
export interface CustomDomainProps {
    /**
     * The domain to be assigned to the API endpoint (ie. api.domain.com)
     */
    domainName?: string;
    /**
     * The hosted zone in Route 53 that contains the domain. By default, SST will look for a hosted zone by stripping out the first part of the domainName that's passed in. So, if your domainName is api.domain.com. SST will default the hostedZone to domain.com.
     */
    hostedZone?: string;
    /**
     * DNS record type for the Route 53 record associated with the custom domain. Default is CNAME.
     * @default CNAME
     */
    recordType?: "CNAME" | "A_AAAA";
    /**
     * Set this option if the domain is not hosted on Amazon Route 53.
     */
    isExternalDomain?: boolean;
    cdk?: {
        /**
         * Override the internally created hosted zone
         */
        hostedZone?: route53.IHostedZone;
        /**
         * Override the internally created certificate
         */
        certificate?: acm.ICertificate;
    };
}
interface CustomDomainData {
    certificate: acm.ICertificate;
    domainName: string;
    hostedZone?: route53.IHostedZone;
    recordType?: CustomDomainProps["recordType"];
}
export declare function buildCustomDomainData(scope: AppSyncApi, customDomain: string | CustomDomainProps | undefined): CustomDomainData | undefined;
export declare function cleanup(scope: AppSyncApi, domainData: CustomDomainData): void;
export {};
