import { Construct } from "constructs";
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import { SSTConstruct } from "./Construct.js";
import { Function as Func, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { Permissions } from "./util/permission.js";
export interface CronJobProps {
    /**
     * The function that will be executed when the job runs.
     *
     * @example
     * ```js
     *   new Cron(stack, "Cron", {
     *     job: {
     *       function: "src/lambda.main",
     *     },
     *   });
     * ```
     */
    function: FunctionDefinition;
    cdk?: {
        /**
         * Override the default settings this construct uses internally to create the events rule.
         */
        target?: eventsTargets.LambdaFunctionProps;
    };
}
export interface CronProps {
    /**
     * The definition of the function to be executed.
     *
     * @example
     * ```js
     * new Cron(stack, "Cron", {
     *   job : "src/lambda.main",
     *   schedule: "rate(5 minutes)",
     * })
     * ```
     */
    job: FunctionInlineDefinition | CronJobProps;
    /**
     * The schedule for the cron job.
     *
     * The string format takes a [rate expression](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents-expressions.html).
     *
     * ```txt
     * rate(1 minute)
     * rate(5 minutes)
     * rate(1 hour)
     * rate(5 hours)
     * rate(1 day)
     * rate(5 days)
     * ```
     * Or as a [cron expression](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions).
     *
     * ```txt
     * cron(15 10 * * ? *)    // 10:15 AM (UTC) every day.
     * ```
     *
     * @example
     * ```js
     * new Cron(stack, "Cron", {
     *   job: "src/lambda.main",
     *   schedule: "rate(5 minutes)",
     * });
     * ```
     * ```js
     * new Cron(stack, "Cron", {
     *   job: "src/lambda.main",
     *   schedule: "cron(15 10 * * ? *)",
     * });
     * ```
     */
    schedule?: `rate(${string})` | `cron(${string})`;
    /**
     * Indicates whether the cron job is enabled.
     * @default true
     * @example
     * ```js
     * new Cron(stack, "Cron", {
     *   job: "src/lambda.main",
     *   schedule: "rate(5 minutes)",
     *   enabled: app.mode === "dev",
     * })
     * ```
     */
    enabled?: boolean;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Override the default settings this construct uses internally to create the events rule.
         */
        rule?: events.RuleProps;
    };
}
/**
 * The `Cron` construct is a higher level CDK construct that makes it easy to create a cron job.
 *
 * @example
 *
 * ```js
 * import { Cron } from "sst/constructs";
 *
 * new Cron(stack, "Cron", {
 *   schedule: "rate(1 minute)",
 *   job: "src/lambda.main",
 * });
 * ```
 */
export declare class Cron extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created CDK EventBridge Rule instance.
         */
        rule: events.Rule;
    };
    /**
     * The internally created Function instance that'll be run on schedule.
     */
    readonly jobFunction: Func;
    private props;
    constructor(scope: Construct, id: string, props: CronProps);
    /**
     * Binds the given list of resources to the cron job.
     *
     * @example
     *
     * ```js
     * cron.bind([STRIPE_KEY, bucket]);
     * ```
     *
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Attaches the given list of permissions to the cron job. This allows the function to access other AWS resources.
     *
     * @example
     *
     * ```js
     * cron.attachPermissions(["s3"]);
     * ```
     *
     */
    attachPermissions(permissions: Permissions): void;
    getConstructMetadata(): {
        type: "Cron";
        data: {
            schedule: string | undefined;
            ruleName: string;
            job: {
                node: string;
                stack: string;
            } | undefined;
        };
    };
    /** @internal */
    getFunctionBinding(): undefined;
    private createEventsRule;
    private createRuleTarget;
}
