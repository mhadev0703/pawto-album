import { CloudFormationClient, DeleteStackCommand, } from "@aws-sdk/client-cloudformation";
import { useBus } from "../bus.js";
import { useAWSClient, useAWSProvider } from "../credentials.js";
import { Logger } from "../logger.js";
import { monitor, isFailed } from "./monitor.js";
export async function removeMany(stacks) {
    await useAWSProvider();
    const bus = useBus();
    const complete = new Set();
    const todo = new Set(stacks.map((s) => s.id));
    const results = {};
    return new Promise((resolve) => {
        async function trigger() {
            for (const stack of stacks) {
                if (!todo.has(stack.id))
                    continue;
                Logger.debug("Checking if", stack.id, "can be removed");
                const waiting = stacks.filter((dependant) => {
                    if (dependant.id === stack.id)
                        return false;
                    if (complete.has(dependant.id))
                        return false;
                    return dependant.dependencies?.some((d) => d.id === stack.id);
                });
                if (waiting.length) {
                    Logger.debug("Waiting on", waiting.map((s) => s.id));
                    continue;
                }
                remove(stack).then((result) => {
                    results[stack.id] = result;
                    complete.add(stack.id);
                    if (isFailed(result.status))
                        stacks.forEach((s) => {
                            if (todo.delete(s.stackName)) {
                                complete.add(s.stackName);
                                results[s.id] = {
                                    status: "DEPENDENCY_FAILED",
                                    outputs: {},
                                    errors: {},
                                };
                                bus.publish("stack.status", {
                                    stackID: s.id,
                                    status: "DEPENDENCY_FAILED",
                                });
                            }
                        });
                    if (complete.size === stacks.length) {
                        resolve(results);
                    }
                    trigger();
                });
                todo.delete(stack.id);
            }
        }
        trigger();
    });
}
export async function remove(stack) {
    Logger.debug("Removing stack", stack.id);
    const cfn = useAWSClient(CloudFormationClient);
    try {
        await cfn.send(new DeleteStackCommand({
            StackName: stack.stackName,
        }));
        return monitor(stack.stackName);
    }
    catch (ex) {
        return {
            errors: {
                stack: ex.message,
            },
            outputs: {},
            status: "UPDATE_FAILED",
        };
    }
}
