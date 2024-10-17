import { CloudFormationClient, DescribeStackResourcesCommand, DescribeStacksCommand, DescribeStackEventsCommand, } from "@aws-sdk/client-cloudformation";
import { useBus } from "../bus.js";
import { useAWSClient } from "../credentials.js";
import { Logger } from "../logger.js";
const STATUSES_PENDING = [
    "CREATE_IN_PROGRESS",
    "DELETE_IN_PROGRESS",
    "REVIEW_IN_PROGRESS",
    "ROLLBACK_IN_PROGRESS",
    "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS",
    "UPDATE_IN_PROGRESS",
    "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS",
    "UPDATE_ROLLBACK_IN_PROGRESS",
    "PUBLISH_ASSETS_IN_PROGRESS",
];
const STATUSES_SUCCESS = [
    "CREATE_COMPLETE",
    "UPDATE_COMPLETE",
    "DELETE_COMPLETE",
    "SKIPPED",
];
const STATUSES_FAILED = [
    "CREATE_FAILED",
    "DELETE_FAILED",
    "ROLLBACK_FAILED",
    "ROLLBACK_COMPLETE",
    "UPDATE_FAILED",
    "UPDATE_ROLLBACK_COMPLETE",
    "UPDATE_ROLLBACK_FAILED",
    "DEPENDENCY_FAILED",
];
export const STATUSES = [
    ...STATUSES_PENDING,
    ...STATUSES_SUCCESS,
    ...STATUSES_FAILED,
];
export function isFinal(input) {
    return (STATUSES_SUCCESS.includes(input) ||
        STATUSES_FAILED.includes(input));
}
export function isFailed(input) {
    return STATUSES_FAILED.includes(input);
}
export function isSuccess(input) {
    return STATUSES_SUCCESS.includes(input);
}
export function isPending(input) {
    return STATUSES_PENDING.includes(input);
}
export async function monitor(stack) {
    const [cfn, bus] = await Promise.all([
        useAWSClient(CloudFormationClient),
        useBus(),
    ]);
    let lastStatus;
    const errors = {};
    let lastEvent;
    while (true) {
        try {
            const [describe, resources, events] = await Promise.all([
                cfn.send(new DescribeStacksCommand({
                    StackName: stack,
                })),
                cfn.send(new DescribeStackResourcesCommand({
                    StackName: stack,
                })),
                cfn.send(new DescribeStackEventsCommand({
                    StackName: stack,
                })),
            ]);
            Logger.debug("Stack description", describe);
            if (lastEvent) {
                const eventsReversed = [...(events.StackEvents ?? [])].reverse();
                for (const event of eventsReversed) {
                    if (!event.Timestamp)
                        continue;
                    if (event.Timestamp.getTime() > lastEvent.getTime()) {
                        bus.publish("stack.event", {
                            event: event,
                            stackID: stack,
                        });
                        if (event.ResourceStatusReason) {
                            if (event.ResourceStatusReason.includes("Resource creation cancelled") ||
                                event.ResourceStatusReason.includes("Resource update cancelled") ||
                                event.ResourceStatusReason.includes("Resource creation Initiated") ||
                                // ie. The following resource(s) failed to update: [MyResource10A5921D].
                                event.ResourceStatusReason.startsWith("The following resource(s) failed to"))
                                continue;
                            errors[event.LogicalResourceId] = event.ResourceStatusReason;
                        }
                    }
                }
                Logger.debug("Last event set to", lastEvent);
            }
            lastEvent = events.StackEvents?.at(0)?.Timestamp;
            bus.publish("stack.resources", {
                stackID: stack,
                resources: resources.StackResources,
            });
            for (const resource of resources.StackResources || []) {
                if (resource.ResourceStatusReason?.includes("Resource creation cancelled") ||
                    resource.ResourceStatusReason?.includes("Resource update cancelled") ||
                    resource.ResourceStatusReason?.includes("Resource creation Initiated") ||
                    // ie. The following resource(s) failed to update: [MyResource10A5921D].
                    resource.ResourceStatusReason?.startsWith("The following resource(s) failed to"))
                    continue;
                if (resource.ResourceStatusReason)
                    errors[resource.LogicalResourceId] = resource.ResourceStatusReason;
            }
            const [first] = describe.Stacks || [];
            if (first) {
                if (lastStatus !== first.StackStatus && first.StackStatus) {
                    lastStatus = first.StackStatus;
                    bus.publish("stack.status", {
                        stackID: stack,
                        status: first.StackStatus,
                    });
                    Logger.debug(first);
                    if (isFinal(first.StackStatus)) {
                        return {
                            status: first.StackStatus,
                            outputs: pipe(first.Outputs || [], map((o) => [o.OutputKey, o.OutputValue]), Object.fromEntries, filterOutputs),
                            errors: isFailed(first.StackStatus) ? errors : {},
                        };
                    }
                }
            }
        }
        catch (ex) {
            if (ex.message.includes("does not exist")) {
                bus.publish("stack.status", {
                    stackID: stack,
                    status: "DELETE_COMPLETE",
                });
                return {
                    status: "DELETE_COMPLETE",
                    outputs: {},
                    errors: {},
                };
            }
            throw ex;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}
import { map, omitBy, pipe } from "remeda";
export function filterOutputs(input) {
    return pipe(input, omitBy((_, key) => {
        return key.startsWith("Export") || key === "SSTMetadata";
    }));
}
