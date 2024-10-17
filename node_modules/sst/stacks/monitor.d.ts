import { DescribeStackResourcesOutput, StackEvent } from "@aws-sdk/client-cloudformation";
declare module "../bus.js" {
    interface Events {
        "stack.updated": {
            stackID: string;
        };
        "stack.status": {
            stackID: string;
            status: (typeof STATUSES)[number];
        };
        "stack.resources": {
            stackID: string;
            resources: DescribeStackResourcesOutput["StackResources"];
        };
        "stack.event": {
            stackID: string;
            event: StackEvent;
        };
    }
}
export declare const STATUSES: readonly ["CREATE_IN_PROGRESS", "DELETE_IN_PROGRESS", "REVIEW_IN_PROGRESS", "ROLLBACK_IN_PROGRESS", "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS", "UPDATE_IN_PROGRESS", "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS", "UPDATE_ROLLBACK_IN_PROGRESS", "PUBLISH_ASSETS_IN_PROGRESS", "CREATE_COMPLETE", "UPDATE_COMPLETE", "DELETE_COMPLETE", "SKIPPED", "CREATE_FAILED", "DELETE_FAILED", "ROLLBACK_FAILED", "ROLLBACK_COMPLETE", "UPDATE_FAILED", "UPDATE_ROLLBACK_COMPLETE", "UPDATE_ROLLBACK_FAILED", "DEPENDENCY_FAILED"];
export declare function isFinal(input: string): boolean;
export declare function isFailed(input: string): boolean;
export declare function isSuccess(input: string): boolean;
export declare function isPending(input: string): boolean;
export declare function monitor(stack: string): Promise<{
    status: string;
    outputs: Record<string, string>;
    errors: Record<string, string>;
}>;
export declare function filterOutputs(input: Record<string, string>): Record<string, string>;
export type StackDeploymentResult = Awaited<ReturnType<typeof monitor>>;
