import type { CloudFormationStackArtifact } from "aws-cdk-lib/cx-api";
import { StackDeploymentResult } from "./monitor.js";
export declare function publishAssets(stacks: CloudFormationStackArtifact[]): Promise<Record<string, any>>;
export declare function deployMany(stacks: CloudFormationStackArtifact[]): Promise<Record<string, {
    status: string;
    outputs: Record<string, string>;
    errors: Record<string, string>;
}>>;
export declare function deploy(stack: CloudFormationStackArtifact): Promise<StackDeploymentResult>;
