import { createProxy, getVariables2 } from "../util/index.js";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
const lambda = new LambdaClient({});
export const Job = /* @__PURE__ */ (() => {
    const result = createProxy("Job");
    const vars = getVariables2("Job");
    Object.keys(vars).forEach((name) => {
        // @ts-expect-error
        result[name] = JobControl(name, vars[name]);
    });
    return result;
})();
function JobControl(name, vars) {
    const functionName = vars.functionName;
    return {
        async run(props) {
            // Invoke the Lambda function
            const ret = await lambda.send(new InvokeCommand({
                FunctionName: functionName,
                Payload: Buffer.from(JSON.stringify({ action: "run", payload: props?.payload })),
            }));
            if (ret.FunctionError) {
                throw new Error(`Failed to invoke the "${name}" job. Error: ${ret.FunctionError}`);
            }
            const resp = JSON.parse(Buffer.from(ret.Payload).toString());
            return {
                jobId: resp.jobId,
            };
        },
        async cancel(jobId) {
            // Invoke the Lambda function
            const ret = await lambda.send(new InvokeCommand({
                FunctionName: functionName,
                Payload: Buffer.from(JSON.stringify({ action: "cancel", jobId })),
            }));
            if (ret.FunctionError) {
                throw new Error(`Failed to cancel the "${name}" job id ${jobId}. Error: ${ret.FunctionError}`);
            }
        },
    };
}
/**
 * Create a new job handler.
 *
 * @example
 * ```ts
 * declare module "sst/node/job" {
 *   export interface JobTypes {
 *     MyJob: {
 *       title: string;
 *     };
 *   }
 * }
 *
 * export const handler = JobHandler("MyJob", async (payload) => {
 *   console.log(payload.title);
 * })
 * ```
 */
export function JobHandler(name, cb) {
    return function handler(event) {
        return cb(event);
    };
}
