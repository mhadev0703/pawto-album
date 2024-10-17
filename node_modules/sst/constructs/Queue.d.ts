import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Permissions } from "./util/permission.js";
/**
 * Used to define the consumer for the queue and invocation details
 */
export interface QueueConsumerProps {
    /**
     * Used to create the consumer function for the queue.
     *
     * @example
     * ```js
     * new Queue(stack, "Queue", {
     *   consumer: {
     *     function: {
     *       handler: "src/function.handler",
     *       timeout: 10,
     *     },
     *   },
     * });
     * ```
     */
    function?: FunctionDefinition;
    cdk?: {
        /**
         * This allows you to use an existing or imported Lambda function.
         *
         * @example
         * ```js
         * new Queue(stack, "Queue", {
         *   consumer: {
         *     cdk: {
         *       function: lambda.Function.fromFunctionAttributes(stack, "ImportedFn", {
         *         functionArn: "arn:aws:lambda:us-east-1:123456789:function:my-function",
         *         role: iam.Role.fromRoleArn(stack, "IRole", "arn:aws:iam::123456789:role/my-role"),
         *       }),
         *     },
         *   },
         * });
         * ```
         */
        function?: lambda.IFunction;
        /**
         * This allows you to override the default settings this construct uses internally to create the consumer.
         *
         * @example
         * ```js
         * new Queue(stack, "Queue", {
         *   consumer: {
         *     function: "test/lambda.handler",
         *     cdk: {
         *       eventSource: {
         *         batchSize: 5,
         *       },
         *     },
         *   },
         * });
         * ```
         */
        eventSource?: lambdaEventSources.SqsEventSourceProps;
    };
}
export interface QueueProps {
    /**
     * Used to create the consumer for the queue.
     *
     * @example
     * ```js
     * new Queue(stack, "Queue", {
     *   consumer: "src/function.handler",
     * })
     * ```
     */
    consumer?: FunctionInlineDefinition | QueueConsumerProps;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Override the default settings this construct uses internally to create the queue.
         *
         * @example
         * ```js
         * new Queue(stack, "Queue", {
         *   consumer: "src/function.handler",
         *   cdk: {
         *     queue: {
         *       fifo: true,
         *     },
         *   }
         * });
         * ```
         */
        queue?: sqs.IQueue | sqs.QueueProps;
    };
}
/**
 * The `Queue` construct is a higher level CDK construct that makes it easy to create an SQS Queue and configure a consumer function.
 *
 * @example
 *
 * ```js
 * import { Queue } from "sst/constructs";
 *
 * new Queue(stack, "Queue", {
 *   consumer: "src/queueConsumer.main",
 * });
 * ```
 */
export declare class Queue extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created CDK `Queue` instance.
         */
        queue: sqs.IQueue;
    };
    /**
     * The internally created consumer `Function` instance.
     */
    consumerFunction?: Fn | lambda.IFunction;
    private bindingForAllConsumers;
    private permissionsAttachedForAllConsumers;
    private props;
    constructor(scope: Construct, id: string, props?: QueueProps);
    /**
     * The ARN of the SQS Queue
     */
    get queueArn(): string;
    /**
     * The URL of the SQS Queue
     */
    get queueUrl(): string;
    /**
     * The name of the SQS Queue
     */
    get queueName(): string;
    /**
     * Adds a consumer after creating the queue. Note only one consumer can be added to a queue
     *
     * @example
     * ```js {3}
     * const queue = new Queue(stack, "Queue");
     * queue.addConsumer(props.stack, "src/function.handler");
     * ```
     */
    addConsumer(scope: Construct, consumer: FunctionInlineDefinition | QueueConsumerProps): void;
    private addCdkFunctionConsumer;
    private addFunctionConsumer;
    /**
     * Binds the given list of resources to the consumer function
     *
     * @example
     * ```js
     * const queue = new Queue(stack, "Queue", {
     *   consumer: "src/function.handler",
     * });
     * queue.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Attaches additional permissions to the consumer function
     *
     * @example
     * ```js
     * const queue = new Queue(stack, "Queue", {
     *   consumer: "src/function.handler",
     * });
     * queue.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    getConstructMetadata(): {
        type: "Queue";
        data: {
            name: string;
            url: string;
            consumer: {
                node: string;
                stack: string;
            } | undefined;
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    private createQueue;
}
