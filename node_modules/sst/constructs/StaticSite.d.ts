import { Construct } from "constructs";
import { Bucket, BucketProps, IBucket } from "aws-cdk-lib/aws-s3";
import { IDistribution } from "aws-cdk-lib/aws-cloudfront";
import { DistributionDomainProps } from "./Distribution.js";
import { BaseSiteFileOptions, BaseSiteReplaceProps, BaseSiteCdkDistributionProps } from "./BaseSite.js";
import { SSTConstruct } from "./Construct.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
export interface StaticSiteProps {
    /**
     * Path to the directory where the website source is located.
     * @default "."
     * @example
     * ```js
     * new StaticSite(stack, "Site", {
     *   path: "path/to/src",
     * });
     * ```
     */
    path?: string;
    /**
     * The name of the index page (e.g. "index.html") of the website.
     * @default "index.html"
     * @example
     * ```js
     * new StaticSite(stack, "Site", {
     *   indexPage: "other-index.html",
     * });
     * ```
     */
    indexPage?: string;
    /**
     * The error page behavior for this website. Takes either an HTML page.
     * ```
     * 404.html
     * ```
     * Or the constant `"redirect_to_index_page"` to redirect to the index page.
     *
     * Note that, if the error pages are redirected to the index page, the HTTP status code is set to 200. This is necessary for single page apps, that handle 404 pages on the client side.
     * @default redirect_to_index_page
     * @example
     * ```js
     * new StaticSite(stack, "Site", {
     *   errorPage: "redirect_to_index_page",
     * });
     * ```
     */
    errorPage?: "redirect_to_index_page" | Omit<string, "redirect_to_index_page">;
    /**
     * The command for building the website
     * @default no build command
     * @example
     * ```js
     * new StaticSite(stack, "Site", {
     *   buildCommand: "npm run build",
     * });
     * ```
     */
    buildCommand?: string;
    /**
     * The directory with the content that will be uploaded to the S3 bucket. If a `buildCommand` is provided, this is usually where the build output is generated. The path is relative to the [`path`](#path) where the website source is located.
     * @default entire "path" directory
     * @example
     * ```js
     * new StaticSite(stack, "Site", {
     *   buildOutput: "build",
     * });
     * ```
     */
    buildOutput?: string;
    /**
     * Pass in a list of placeholder values to be replaced in the website content. For example, the follow configuration:
     *
     * @example
     * ```js
     * new StaticSite(stack, "frontend", {
     *   replaceValues: [
     *     {
     *       files: "*.js",
     *       search: "{{ API_URL }}",
     *       replace: api.url,
     *     },
     *     {
     *       files: "*.js",
     *       search: "{{ COGNITO_USER_POOL_CLIENT_ID }}",
     *       replace: auth.cognitoUserPoolClient.userPoolClientId,
     *     },
     *   ],
     * });
     * ```
     */
    replaceValues?: StaticSiteReplaceProps[];
    /**
     * The customDomain for this website. SST supports domains that are hosted either on [Route 53](https://aws.amazon.com/route53/) or externally.
     *
     * Note that you can also migrate externally hosted domains to Route 53 by [following this guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/MigratingDNS.html).
     *
     * @example
     * ```js
     * new StaticSite(stack, "frontend", {
     *   path: "path/to/src",
     *   customDomain: "domain.com",
     * });
     * ```
     *
     * @example
     * ```js
     * new StaticSite(stack, "frontend", {
     *   path: "path/to/src",
     *   customDomain: {
     *     domainName: "domain.com",
     *     domainAlias: "www.domain.com",
     *     hostedZone: "domain.com"
     *   }
     * });
     * ```
     */
    customDomain?: string | StaticSiteDomainProps;
    /**
     * An object with the key being the environment variable name. Note, this requires your build tool to support build time environment variables.
     *
     * @example
     * ```js
     * new StaticSite(stack, "frontend", {
     *   environment: {
     *     REACT_APP_API_URL: api.url,
     *     REACT_APP_USER_POOL_CLIENT: auth.cognitoUserPoolClient.userPoolClientId,
     *   },
     * });
     * ```
     */
    environment?: Record<string, string>;
    /**
     * While deploying, SST removes old files that no longer exist. Pass in `false` to keep the old files around.
     *
     * @default true
     *
     * @example
     * ```js
     * new StaticSite(stack, "frontend", {
     *  purgeFiles: false
     * });
     * ```
     */
    purgeFiles?: boolean;
    assets?: {
        /**
         * Character encoding for text based assets uploaded to S3 (ex: html, css, js, etc.). If "none" is specified, no charset will be returned in header.
         * @default utf-8
         * @example
         * ```js
         * assets: {
         *   textEncoding: "iso-8859-1"
         * }
         * ```
         */
        textEncoding?: "utf-8" | "iso-8859-1" | "windows-1252" | "ascii" | "none";
        /**
         * Pass in a list of file options to configure cache control for different files. Behind the scenes, the `StaticSite` construct uses a combination of the `s3 cp` and `s3 sync` commands to upload the website content to the S3 bucket. An `s3 cp` command is run for each file option block, and the options are passed in as the command options.
         * @default No cache control for HTML files, and a 1 year cache control for JS/CSS files.
         * ```js
         * assets: {
         *   fileOptions: [
         *     {
         *       files: "**",
         *       cacheControl: "max-age=0,no-cache,no-store,must-revalidate",
         *     },
         *     {
         *       files: "**\/*.{js,css}",
         *       cacheControl: "max-age=31536000,public,immutable",
         *     },
         *   ],
         * }
         * ```
         * @example
         * ```js
         * assets: {
         *   fileOptions: [
         *     {
         *       files: "**\/*.zip",
         *       cacheControl: "private,no-cache,no-store,must-revalidate",
         *       contentType: "application/zip",
         *     },
         *   ],
         * }
         * ```
         */
        fileOptions?: StaticSiteFileOptions[];
    };
    dev?: {
        /**
         * When running `sst dev, site is not deployed. This is to ensure `sst dev` can start up quickly.
         * @default false
         * @example
         * ```js
         * new StaticSite(stack, "frontend", {
         *  dev: {
         *    deploy: true
         *  }
         * });
         * ```
         */
        deploy?: boolean;
        /**
         * The local site URL when running `sst dev`.
         * @example
         * ```js
         * new StaticSite(stack, "frontend", {
         *  dev: {
         *    url: "http://localhost:3000"
         *  }
         * });
         * ```
         */
        url?: string;
    };
    vite?: {
        /**
         * The path where code-gen should place the type definition for environment variables
         * @default "src/sst-env.d.ts"
         * @example
         * ```js
         * new StaticSite(stack, "frontend", {
         *   vite: {
         *     types: "./other/path/sst-env.d.ts",
         *   }
         * });
         * ```
         */
        types?: string;
    };
    /**
     * While deploying, SST waits for the CloudFront cache invalidation process to finish. This ensures that the new content will be served once the deploy command finishes. However, this process can sometimes take more than 5 mins. For non-prod environments it might make sense to pass in `false`. That'll skip waiting for the cache to invalidate and speed up the deploy process.
     * @default false
     * @example
     * ```js
     * new StaticSite(stack, "frontend", {
     *  waitForInvalidation: true
     * });
     * ```
     */
    waitForInvalidation?: boolean;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Allows you to override default settings this construct uses internally to create the bucket
         *
         * @example
         * ```js
         * new StaticSite(stack, "Site", {
         *   path: "path/to/src",
         *   cdk: {
         *     bucket: {
         *       bucketName: "mybucket",
         *     },
         *   }
         * });
         * ```
         */
        bucket?: BucketProps | IBucket;
        /**
         * Configure the internally created CDK `Distribution` instance or provide an existing distribution
         *
         * @example
         * ```js
         * new StaticSite(stack, "Site", {
         *   path: "path/to/src",
         *   cdk: {
         *     distribution: {
         *       comment: "Distribution for my React website",
         *     },
         *   }
         * });
         * ```
         */
        distribution?: IDistribution | StaticSiteCdkDistributionProps;
    };
}
export interface StaticSiteDomainProps extends DistributionDomainProps {
}
export interface StaticSiteFileOptions extends BaseSiteFileOptions {
}
export interface StaticSiteReplaceProps extends BaseSiteReplaceProps {
}
export interface StaticSiteCdkDistributionProps extends BaseSiteCdkDistributionProps {
}
type StaticSiteNormalizedProps = StaticSiteProps & {
    path: Exclude<StaticSiteProps["path"], undefined>;
};
/**
 * The `StaticSite` construct is a higher level CDK construct that makes it easy to create a static website.
 *
 * @example
 *
 * Deploys a plain HTML website in the `path/to/src` directory.
 *
 * ```js
 * import { StaticSite } from "sst/constructs";
 *
 * new StaticSite(stack, "Site", {
 *   path: "path/to/src",
 * });
 * ```
 */
export declare class StaticSite extends Construct implements SSTConstruct {
    readonly id: string;
    private props;
    private doNotDeploy;
    private bucket;
    private distribution;
    constructor(scope: Construct, id: string, props?: StaticSiteProps);
    /**
     * The CloudFront URL of the website.
     */
    get url(): string | undefined;
    /**
     * If the custom domain is enabled, this is the URL of the website with the custom domain.
     */
    get customDomainUrl(): string | undefined;
    /**
     * The internally created CDK resources.
     */
    get cdk(): {
        bucket: Bucket;
        distribution: IDistribution;
        hostedZone: import("aws-cdk-lib/aws-route53").IHostedZone | undefined;
        certificate: import("aws-cdk-lib/aws-certificatemanager").ICertificate | undefined;
    } | undefined;
    getConstructMetadata(): {
        type: "StaticSite";
        data: {
            path: string;
            environment: Record<string, string>;
            customDomainUrl: string | undefined;
            url: string | undefined;
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    private validateDeprecatedFileOptions;
    private generateViteTypes;
    private buildApp;
    private createS3Assets;
    private bundleFilenamesAsset;
    private createS3Bucket;
    private createS3Deployment;
    private createCfDistribution;
    private generateInvalidationId;
    private buildDistributionBehavior;
    private getS3ContentReplaceValues;
}
export declare const useSites: () => {
    add(stack: string, name: string, props: StaticSiteNormalizedProps): void;
    readonly all: {
        stack: string;
        name: string;
        props: StaticSiteNormalizedProps;
    }[];
};
export {};
