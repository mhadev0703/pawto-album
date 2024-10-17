import { Metafile } from "esbuild";
import type { App } from "./constructs/App.js";
export interface SSTConfig {
    config: (globals: GlobalOptions) => Promise<ConfigOptions> | ConfigOptions;
    stacks: (app: App) => Promise<void> | void;
}
export interface ConfigOptions {
    name: string;
    region?: string;
    stage?: string;
    profile?: string;
    role?: string;
    ssmPrefix?: string;
    outputs?: string;
    advanced?: {
        disableParameterizedStackNameCheck?: boolean;
        disableAppModeCheck?: boolean;
    };
    bootstrap?: {
        useCdkBucket?: boolean;
        stackName?: string;
        bucketName?: string;
        tags?: Record<string, string>;
    };
    cdk?: {
        toolkitStackName?: string;
        qualifier?: string;
        bootstrapStackVersionSsmParameter?: string;
        fileAssetsBucketName?: string;
        customPermissionsBoundary?: string;
        publicAccessBlockConfiguration?: boolean;
        deployRoleArn?: string;
        fileAssetPublishingRoleArn?: string;
        imageAssetPublishingRoleArn?: string;
        imageAssetsRepositoryName?: string;
        cloudFormationExecutionRole?: string;
        lookupRoleArn?: string;
        pathMetadata?: boolean;
    };
}
declare const DEFAULTS: {
    readonly stage: undefined;
    readonly ssmPrefix: undefined;
};
interface Project {
    config: ConfigOptions & Required<{
        [key in keyof typeof DEFAULTS]: Exclude<ConfigOptions[key], undefined>;
    }>;
    version: string;
    cdkVersion: string;
    constructsVersion: string;
    paths: {
        root: string;
        config: string;
        out: string;
        artifacts: string;
    };
    metafile: Metafile;
    stacks: SSTConfig["stacks"];
}
export declare function setProject(p: Project): void;
export declare function useProject(): Project;
interface GlobalOptions {
    profile?: string;
    role?: string;
    stage?: string;
    root?: string;
    region?: string;
}
export declare function initProject(globals: GlobalOptions): Promise<void>;
declare function sanitizeStageName(stage: string): string;
declare function isValidStageName(stage: string): boolean;
export declare const exportedForTesting: {
    sanitizeStageName: typeof sanitizeStageName;
    isValidStageName: typeof isValidStageName;
};
export {};
