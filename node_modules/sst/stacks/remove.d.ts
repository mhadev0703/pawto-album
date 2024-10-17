import type { CloudFormationStackArtifact } from "aws-cdk-lib/cx-api";
import { StackDeploymentResult } from "./monitor.js";
export declare function removeMany(stacks: CloudFormationStackArtifact[]): Promise<Record<string, {
    status: string;
    outputs: Record<string, string>;
    errors: Record<string, string>;
}>>;
export declare function remove(stack: CloudFormationStackArtifact): Promise<StackDeploymentResult>;
