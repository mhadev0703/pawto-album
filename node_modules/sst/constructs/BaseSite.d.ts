import { ErrorResponse, DistributionProps, BehaviorOptions, IOrigin } from "aws-cdk-lib/aws-cloudfront";
export interface BaseSiteFileOptions {
    files: string | string[];
    ignore?: string | string[];
    cacheControl?: string;
    contentType?: string;
}
export interface BaseSiteEnvironmentOutputsInfo {
    path: string;
    stack: string;
    environmentOutputs: {
        [key: string]: string;
    };
}
export interface BaseSiteReplaceProps {
    files: string;
    search: string;
    replace: string;
}
export declare function buildErrorResponsesForRedirectToIndex(indexPage: string): ErrorResponse[];
export declare function buildErrorResponsesFor404ErrorPage(errorPage: string): ErrorResponse[];
export interface BaseSiteCdkDistributionProps extends Omit<DistributionProps, "defaultBehavior"> {
    defaultBehavior?: Omit<BehaviorOptions, "origin"> & {
        origin?: IOrigin;
    };
}
export declare function getBuildCmdEnvironment(siteEnvironment?: {
    [key: string]: string;
}): Record<string, string>;
