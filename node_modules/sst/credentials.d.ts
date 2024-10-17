import { SdkProvider } from "sst-aws-cdk/lib/api/aws-auth/sdk-provider.js";
export type {} from "@smithy/types";
export declare const useAWSCredentialsProvider: () => import("@smithy/types").AwsCredentialIdentityProvider;
export declare const useAWSCredentials: () => Promise<import("@smithy/types").AwsCredentialIdentity>;
export declare const useSTSIdentity: () => Promise<import("@aws-sdk/client-sts").GetCallerIdentityCommandOutput>;
export declare function useAWSClient<C extends any>(client: new (config: any) => C, force?: boolean): C;
/**
 * Do not use this. It is only used for AWS CDK compatibility.
 */
export declare const useAWSProvider: () => Promise<SdkProvider>;
