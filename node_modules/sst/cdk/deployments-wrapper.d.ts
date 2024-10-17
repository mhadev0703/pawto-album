import { SdkProvider } from "sst-aws-cdk/lib/api/aws-auth/sdk-provider.js";
import { DeployStackOptions as PublishStackAssetsOptions } from "./deployments.js";
export declare function publishDeployAssets(sdkProvider: SdkProvider, options: PublishStackAssetsOptions): Promise<any>;
