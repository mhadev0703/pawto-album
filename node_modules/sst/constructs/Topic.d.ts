import { ITopic, Subscription, TopicProps as AWSTopicProps } from "aws-cdk-lib/aws-sns";
import { LambdaSubscriptionProps, SqsSubscriptionProps } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionProps, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { Queue } from "./Queue.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Permissions } from "./util/permission.js";
/**
 * Used to define a queue subscriber for a topic
 *
 * @example
 * ```js
 * new Topic(stack, "Topic", {
 *   subscribers: {
 *     subscriber: {
 *       type: "queue",
 *       queue: new Queue(stack, "Queue", {
 *         consumer: "src/function.handler"
 *       })
 *     }
 *   }
 * })
 * ```
 */
export interface TopicQueueSubscriberProps {
    /**
     * String literal to signify that the subscriber is a queue
     */
    type: "queue";
    /**
     * The queue that'll be added as a subscriber to the topic.
     */
    queue: Queue;
    cdk?: {
        /**
         * This allows you to override the default settings this construct uses internally to create the subscriber.
         */
        subscription?: SqsSubscriptionProps;
    };
}
/**
 * Used to define a function subscriber for a topic
 *
 * @example
 * ```js
 * new Topic(stack, "Topic", {
 *   subscribers: {
 *     subscriber: "src/function.handler"
 *   }
 * })
 * ```
 */
export interface TopicFunctionSubscriberProps {
    /**
     * String literal to signify that the subscriber is a function
     */
    type?: "function";
    /**
     * Used to create the subscriber function for the topic
     */
    function: FunctionDefinition;
    cdk?: {
        /**
         * This allows you to override the default settings this construct uses internally to create the subscriber.
         */
        subscription?: LambdaSubscriptionProps;
    };
}
export interface TopicProps {
    defaults?: {
        /**
         * The default function props to be applied to all the consumers in the Topic. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         *
         * ```js
         * new Topic(stack, "Topic", {
         *   defaults: {
         *     function: {
         *       timeout: 20,
         *     }
         *   },
         * });
         * ```
         */
        function?: FunctionProps;
    };
    /**
     * Configure subscribers for this topic
     *
     * @example
     * ```js
     * new Topic(stack, "Topic", {
     *   subscribers: {
     *     subscriber1: "src/function1.handler",
     *     subscriber2: "src/function2.handler"
     *   },
     * });
     * ```
     */
    subscribers?: Record<string, FunctionInlineDefinition | TopicFunctionSubscriberProps | Queue | TopicQueueSubscriberProps>;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Override the default settings this construct uses internally to create the topic.
         */
        topic?: ITopic | AWSTopicProps;
    };
}
/**
 * The `Topic` construct is a higher level CDK construct that makes it easy to create an SNS Topic and configure a list of subscriber functions.
 *
 * @example
 *
 * ```js
 * import { Topic } from "sst/constructs";
 *
 * new Topic(stack, "Topic", {
 *   subscribers: {
 *     subscriber1: "src/function1.handler",
 *     subscriber2: "src/function2.handler"
 *   },
 * });
 * ```
 */
export declare class Topic extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created CDK `Topic` instance.
         */
        topic: ITopic;
    };
    private subscribers;
    private bindingForAllSubscribers;
    private permissionsAttachedForAllSubscribers;
    private props;
    constructor(scope: Construct, id: string, props?: TopicProps);
    /**
     * The ARN of the internally created SNS Topic.
     */
    get topicArn(): string;
    /**
     * The name of the internally created SNS Topic.
     */
    get topicName(): string;
    /**
     * Get a list of subscriptions for this topic
     */
    get subscriptions(): Subscription[];
    /**
     * A list of the internally created function instances for the subscribers.
     */
    get subscriberFunctions(): Fn[];
    /**
     * Add subscribers to the topic.
     *
     * @example
     * ```js
     * const topic = new Topic(stack, "Topic", {
     *   subscribers: {
     *     subscriber1: "src/function1.handler",
     *     subscriber2: "src/function2.handler"
     *   },
     * });
     * topic.addSubscribers(stack, {
     *   subscriber3: "src/function3.handler"
     * });
     * ```
     */
    addSubscribers(scope: Construct, subscribers: {
        [subscriberName: string]: FunctionInlineDefinition | TopicFunctionSubscriberProps | Queue | TopicQueueSubscriberProps;
    }): void;
    /**
     * Binds the given list of resources to all the subscriber functions.
     *
     * @example
     *
     * ```js
     * const topic = new Topic(stack, "Topic", {
     *   subscribers: {
     *     subscriber1: "src/function1.handler",
     *     subscriber2: "src/function2.handler"
     *   },
     * });
     * topic.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Binds the given list of resources to a specific subscriber.
     * @example
     * ```js {8}
     * const topic = new Topic(stack, "Topic", {
     *   subscribers: {
     *     subscriber1: "src/function1.handler",
     *     subscriber2: "src/function2.handler"
     *   },
     * });
     *
     * topic.bindToSubscriber("subscriber1", [STRIPE_KEY, bucket]);
     * ```
     */
    bindToSubscriber(subscriberName: string, constructs: SSTConstruct[]): void;
    /**
     * Attaches the given list of permissions to all the subscriber functions. This allows the subscribers to access other AWS resources.
     *
     * @example
     *
     * ```js
     * const topic = new Topic(stack, "Topic", {
     *   subscribers: {
     *     subscriber1: "src/function1.handler",
     *     subscriber2: "src/function2.handler"
     *   },
     * });
     * topic.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Attaches the list of permissions to a specific subscriber.
     * @example
     * ```js {8}
     * const topic = new Topic(stack, "Topic", {
     *   subscribers: {
     *     subscriber1: "src/function1.handler",
     *     subscriber2: "src/function2.handler"
     *   },
     * });
     *
     * topic.attachPermissionsToSubscriber("subscriber1", ["s3"]);
     * ```
     */
    attachPermissionsToSubscriber(subscriberName: string, permissions: Permissions): void;
    getConstructMetadata(): {
        type: "Topic";
        data: {
            topicArn: string;
            subscribers: ({
                node: string;
                stack: string;
            } | undefined)[];
            subscriberNames: string[];
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    private createTopic;
    private addSubscriber;
    private addQueueSubscriber;
    private addFunctionSubscriber;
}
