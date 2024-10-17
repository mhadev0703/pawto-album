import { Construct } from "constructs";
import * as kinesis from "aws-cdk-lib/aws-kinesis";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionProps, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Permissions } from "./util/permission.js";
/**
 * Used to define the function consumer for the stream
 */
export interface KinesisStreamConsumerProps {
    /**
     * The function definition
     *
     * @example
     * ```js
     * new KinesisStream(stack, "Stream", {
     *   consumers: {
     *     consumer1: {
     *       function: {
     *         handler: "src/consumer1.handler",
     *         timeout: 30
     *       }
     *     }
     *   }
     * });
     * ```
     */
    function: FunctionDefinition;
    cdk?: {
        /**
         * Override the interally created event source
         *
         * @example
         * ```js
         * new KinesisStream(stack, "Stream", {
         *   consumers: {
         *     fun: {
         *       cdk: {
         *         eventSource: {
         *           enabled: false
         *         }
         *       }
         *     }
         *   }
         * });
         * ```
         */
        eventSource?: lambdaEventSources.KinesisEventSourceProps;
    };
}
export interface KinesisStreamProps {
    defaults?: {
        /**
         * The default function props to be applied to all the Lambda functions in the API. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         * ```js
         * new KinesisStream(stack, "Stream", {
         *   defaults: {
         *     function: {
         *       timeout: 20,
         *     }
         *   }
         * });
         * ```
         */
        function?: FunctionProps;
    };
    /**
     * Define the function consumers for this stream
     *
     * @example
     * ```js
     * new KinesisStream(stack, "Stream", {
     *   consumers: {
     *     consumer1: "src/consumer1.main",
     *     consumer2: {
     *       function: {
     *         handler: "src/consumer2.handler",
     *         timeout: 30
     *       }
     *     }
     *   }
     * });
     * ```
     */
    consumers?: Record<string, FunctionInlineDefinition | KinesisStreamConsumerProps>;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Override the internally created Kinesis Stream
         *
         * @example
         * ```js
         * new KinesisStream(stack, "Stream", {
         *   cdk: {
         *     stream: {
         *       streamName: "my-stream",
         *     }
         *   }
         * });
         * ```
         */
        stream?: kinesis.IStream | kinesis.StreamProps;
    };
}
/**
 * The `KinesisStream` construct is a higher level CDK construct that makes it easy to create a Kinesis Data Stream and add a list of consumers to it.
 *
 * @example
 *
 * ```js
 * import { KinesisStream } from "sst/constructs";
 *
 * new KinesisStream(stack, "Stream", {
 *   consumers: {
 *     myConsumer: "src/lambda.main",
 *   }
 * });
 * ```
 */
export declare class KinesisStream extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * Return internally created Kinesis Stream
         */
        stream: kinesis.IStream;
    };
    private functions;
    private readonly bindingForAllConsumers;
    private readonly permissionsAttachedForAllConsumers;
    private readonly props;
    constructor(scope: Construct, id: string, props?: KinesisStreamProps);
    /**
     * The ARN of the internally created Kinesis Stream
     */
    get streamArn(): string;
    /**
     * The name of the internally created Kinesis Stream
     */
    get streamName(): string;
    /**
     * Add consumers to a stream after creating it
     *
     * @example
     * ```js
     * stream.addConsumers(stack, {
     *   consumer1: "src/function.handler"
     * })
     * ```
     */
    addConsumers(scope: Construct, consumers: {
        [consumerName: string]: FunctionInlineDefinition | KinesisStreamConsumerProps;
    }): void;
    /**
     * Binds the given list of resources to all the consumers.
     *
     * @example
     *
     * ```js
     * stream.bind([STRIPE_KEY, bucket]]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Binds the given list of resources to a specific consumer.
     *
     * @example
     * ```js
     * stream.bindToConsumer("consumer1", [STRIPE_KEY, bucket]);
     * ```
     */
    bindToConsumer(consumerName: string, constructs: SSTConstruct[]): void;
    /**
     * Attaches the given list of permissions to all the consumers. This allows the functions to access other AWS resources.
     *
     * @example
     *
     * ```js
     * stream.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Attaches the given list of permissions to a specific consumer. This allows that function to access other AWS resources.
     *
     * @example
     * ```js
     * stream.attachPermissionsToConsumer("consumer1", ["s3"]);
     * ```
     */
    attachPermissionsToConsumer(consumerName: string, permissions: Permissions): void;
    /**
     * Get the function for a specific consumer
     *
     * @example
     * ```js
     * stream.getFunction("consumer1");
     * ```
     */
    getFunction(consumerName: string): Fn | undefined;
    getConstructMetadata(): {
        type: "KinesisStream";
        data: {
            streamName: string;
            consumers: {
                name: string;
                fn: {
                    node: string;
                    stack: string;
                } | undefined;
            }[];
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    private createStream;
    private addConsumer;
}
