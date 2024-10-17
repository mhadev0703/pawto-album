import type { CloudFormationStackArtifact } from "aws-cdk-lib/cx-api";
export declare function diff(stack: CloudFormationStackArtifact, oldTemplate: any): Promise<{
    count: number;
    diff?: undefined;
} | {
    count: number;
    diff: string;
}>;
