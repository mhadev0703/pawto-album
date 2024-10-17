import { Construct } from "constructs";
import { Queue } from "./Queue.js";
import { Topic } from "./Topic.js";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionProps, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Permissions } from "./util/permission.js";
import { Duration } from "./util/duration.js";
import { BucketProps as CDKBucketProps, IBucket, EventType, HttpMethods } from "aws-cdk-lib/aws-s3";
export interface BucketCorsRule {
    /**
     * The collection of allowed HTTP methods.
     */
    allowedMethods: (keyof typeof HttpMethods)[];
    /**
     * The collection of allowed origins.
     *
     * @example
     * ```js
     * // Allow all origins
     * allowOrigins: ["*"]
     *
     * // Allow specific origins. Note that the url protocol, ie. "https://", is required.
     * allowOrigins: ["https://domain.com"]
     * ```
     */
    allowedOrigins: string[];
    /**
     * The collection of allowed headers.
     */
    allowedHeaders?: string[];
    /**
     * The collection of exposed headers.
     */
    exposedHeaders?: string[];
    /**
     * A unique identifier for this rule.
     */
    id?: string;
    /**
     * Specify how long the results of a preflight response can be cached
     */
    maxAge?: Duration;
}
interface BucketBaseNotificationProps {
    /**
     * The S3 event types that will trigger the notification.
     */
    events?: Lowercase<keyof typeof EventType>[];
    /**
     * S3 object key filter rules to determine which objects trigger this event.
     */
    filters?: BucketFilter[];
}
export interface BucketFilter {
    /**
     * Filter what the key starts with
     */
    prefix?: string;
    /**
     * Filter what the key ends with
     */
    suffix?: string;
}
/**
 * Used to define a function listener for the bucket
 *
 * @example
 * ```js
 * new Bucket(stack, "Bucket", {
 *   notifications: {
 *     myNotification: {
 *       function: "src/notification.main"
 *     }
 *   }
 * }
 * ```
 */
export interface BucketFunctionNotificationProps extends BucketBaseNotificationProps {
    /**
     * String literal to signify that the notification is a function
     */
    type?: "function";
    /**
     * The function to send notifications to
     */
    function: FunctionDefinition;
}
/**
 * Used to define a queue listener for the bucket
 *
 * @example
 * ```js
 * new Bucket(stack, "Bucket", {
 *   notifications: {
 *     myNotification: {
 *       type: "queue",
 *       queue: new Queue(stack, "Queue")
 *     }
 *   }
 * }
 * ```
 */
export interface BucketQueueNotificationProps extends BucketBaseNotificationProps {
    /**
     * String literal to signify that the notification is a queue
     */
    type: "queue";
    /**
     * The queue to send notifications to
     */
    queue: Queue;
}
/**
 * Used to define a topic listener for the bucket
 *
 * @example
 * ```js
 * new Bucket(stack, "Bucket", {
 *   notifications: {
 *     myNotification: {
 *       type: "topic",
 *       topic: new Topic(stack, "Topic")
 *     }
 *   }],
 * }
 * ```
 */
export interface BucketTopicNotificationProps extends BucketBaseNotificationProps {
    type: "topic";
    /**
     * The topic to send notifications to
     */
    topic: Topic;
}
export interface BucketProps {
    /**
     * The name of the bucket.
     *
     * Note that it's not recommended to hard code a name for the bucket, because they must be globally unique.
     *
     * @example
     * ```js
     * new Bucket(stack, "Bucket", {
     *   name: "my-bucket",
     * });
     * ```
     */
    name?: string;
    /**
     * The CORS configuration of this bucket.
     * @default true
     * @example
     * ```js
     * new Bucket(stack, "Bucket", {
     *   cors: true,
     * });
     * ```
     *
     * ```js
     * new Bucket(stack, "Bucket", {
     *   cors: [
     *     {
     *       allowedMethods: ["GET"],
     *       allowedOrigins: ["https://www.example.com"],
     *     }
     *   ],
     * });
     * ```
     */
    cors?: boolean | BucketCorsRule[];
    /**
     * Prevent any files from being uploaded with public access configured. Setting this to `true` prevents uploading objects with public ACLs.
     * Note that setting to `false` does not necessarily mean that the bucket is completely accessible to the public. Rather, it enables the granting of public permissions on a per file basis.
     * @default false
     * @example
     * ```js
     * new Bucket(stack, "Bucket", {
     *   blockPublicACLs: true,
     * });
     * ```
     */
    blockPublicACLs?: boolean;
    /**
     * The default function props to be applied to all the Lambda functions in the API. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
     *
     * @example
     * ```js
     * new Bucket(stack, "Bucket", {
     *   defaults: {
     *     function: {
     *       timeout: 20,
     *     }
     *   },
     * });
     * ```
     */
    defaults?: {
        function?: FunctionProps;
    };
    /**
     * Used to create notifications for various bucket events
     *
     * @example
     * ```js
     * new Bucket(stack, "Bucket", {
     *   notifications: {
     *     myNotification: "src/notification.main",
     *   }
     * });
     * ```
     */
    notifications?: Record<string, FunctionInlineDefinition | BucketFunctionNotificationProps | Queue | BucketQueueNotificationProps | Topic | BucketTopicNotificationProps>;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Allows you to override default settings this construct uses internally to create the bucket.
         *
         * @example
         * ```js
         * new Bucket(stack, "Bucket", {
         *   cdk: {
         *     bucket: {
         *       bucketName: "my-bucket",
         *     },
         *   }
         * });
         * ```
         */
        bucket?: IBucket | CDKBucketProps;
    };
}
/**
 * The `Bucket` construct is a higher level CDK construct that makes it easy to create an S3 Bucket and to define its notifications.
 *
 * @example
 *
 * ```js
 * import { Bucket } from "sst/constructs";
 *
 * new Bucket(stack, "Bucket");
 * ```
 */
export declare class Bucket extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created CDK `Bucket` instance.
         */
        bucket: IBucket;
    };
    readonly notifications: Record<string, Fn | Queue | Topic>;
    readonly bindingForAllNotifications: SSTConstruct[];
    readonly permissionsAttachedForAllNotifications: Permissions[];
    readonly props: BucketProps;
    constructor(scope: Construct, id: string, props?: BucketProps);
    /**
     * The ARN of the internally created `Bucket` instance.
     */
    get bucketArn(): string;
    /**
     * The name of the internally created `Bucket` instance.
     */
    get bucketName(): string;
    /**
     * A list of the internally created functions for the notifications.
     */
    get notificationFunctions(): Fn[];
    /**
     * Add notification subscriptions after the bucket has been created
     *
     * @example
     * ```js {3}
     * const bucket = new Bucket(stack, "Bucket");
     * bucket.addNotifications(stack, {
     *   myNotification: "src/notification.main"
     * });
     * ```
     */
    addNotifications(scope: Construct, notifications: Record<string, FunctionInlineDefinition | BucketFunctionNotificationProps | Queue | BucketQueueNotificationProps | Topic | BucketTopicNotificationProps>): void;
    /**
     * Binds the given list of resources to all bucket notifications
     * @example
     * ```js {20}
     * const bucket = new Bucket(stack, "Bucket", {
     *   notifications: {
     *     myNotification: "src/function.handler",
     *   }
     * });
     *
     * bucket.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Binds the given list of resources to a specific bucket notification
     *
     * @example
     * ```js {20}
     * const bucket = new Bucket(stack, "Bucket", {
     *   notifications: {
     *     myNotification: "src/function.handler",
     *   }
     * });
     *
     * bucket.bindToNotification("myNotification", ["s3"]);
     * ```
     */
    bindToNotification(notificationName: string, constructs: SSTConstruct[]): void;
    /**
     * Attaches additional permissions to all bucket notifications
     * @example
     * ```js {20}
     * const bucket = new Bucket(stack, "Bucket", {
     *   notifications: {
     *     myNotification: "src/function.handler",
     *   }
     * });
     *
     * bucket.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Attaches additional permissions to a specific bucket notification
     *
     * @example
     * ```js {20}
     * const bucket = new Bucket(stack, "Bucket", {
     *   notifications: {
     *     myNotification: "src/function.handler",
     *   }
     * });
     *
     * bucket.attachPermissionsToNotification("myNotification", ["s3"]);
     * ```
     */
    attachPermissionsToNotification(notificationName: string, permissions: Permissions): void;
    getConstructMetadata(): {
        type: "Bucket";
        data: {
            name: string;
            notifications: ({
                node: string;
                stack: string;
            } | undefined)[];
            notificationNames: string[];
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    private createBucket;
    private addNotification;
    private addQueueNotification;
    private addTopicNotification;
    private addFunctionNotification;
    private buildCorsConfig;
    private buildBlockPublicAccessConfig;
    private buildObjectOwnershipConfig;
}
export {};
