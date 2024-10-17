import { Construct } from "constructs";
import { Queue } from "./Queue.js";
import { Topic } from "./Topic.js";
import { getFunctionRef, isCDKConstruct } from "./Construct.js";
import { Function as Fn, } from "./Function.js";
import { toCdkDuration } from "./util/duration.js";
import { Bucket as CDKBucket, BlockPublicAccess, EventType, HttpMethods, ObjectOwnership, } from "aws-cdk-lib/aws-s3";
import { LambdaDestination, SnsDestination, SqsDestination, } from "aws-cdk-lib/aws-s3-notifications";
/////////////////////
// Construct
/////////////////////
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
export class Bucket extends Construct {
    id;
    cdk;
    notifications = {};
    bindingForAllNotifications = [];
    permissionsAttachedForAllNotifications = [];
    props;
    constructor(scope, id, props) {
        super(scope, props?.cdk?.id || id);
        this.id = id;
        this.props = props || {};
        this.cdk = {};
        this.createBucket();
        this.addNotifications(this, props?.notifications || {});
        const app = this.node.root;
        app.registerTypes(this);
    }
    /**
     * The ARN of the internally created `Bucket` instance.
     */
    get bucketArn() {
        return this.cdk.bucket.bucketArn;
    }
    /**
     * The name of the internally created `Bucket` instance.
     */
    get bucketName() {
        return this.cdk.bucket.bucketName;
    }
    /**
     * A list of the internally created functions for the notifications.
     */
    get notificationFunctions() {
        return Object.values(this.notifications).filter((notification) => notification instanceof Fn);
    }
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
    addNotifications(scope, notifications) {
        Object.entries(notifications).forEach(([notificationName, notification]) => {
            this.addNotification(scope, notificationName, notification);
        });
    }
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
    bind(constructs) {
        this.notificationFunctions.forEach((notification) => notification.bind(constructs));
        this.bindingForAllNotifications.push(...constructs);
    }
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
    bindToNotification(notificationName, constructs) {
        const notification = this.notifications[notificationName];
        if (!(notification instanceof Fn)) {
            throw new Error(`Cannot bind to the "${this.node.id}" Bucket notification because it's not a Lambda function`);
        }
        notification.bind(constructs);
    }
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
    attachPermissions(permissions) {
        this.notificationFunctions.forEach((notification) => notification.attachPermissions(permissions));
        this.permissionsAttachedForAllNotifications.push(permissions);
    }
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
    attachPermissionsToNotification(notificationName, permissions) {
        const notification = this.notifications[notificationName];
        if (!(notification instanceof Fn)) {
            throw new Error(`Cannot attach permissions to the "${this.node.id}" Bucket notification because it's not a Lambda function`);
        }
        notification.attachPermissions(permissions);
    }
    getConstructMetadata() {
        return {
            type: "Bucket",
            data: {
                name: this.cdk.bucket.bucketName,
                notifications: Object.values(this.notifications).map(getFunctionRef),
                notificationNames: Object.keys(this.notifications),
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        return {
            clientPackage: "bucket",
            variables: {
                bucketName: {
                    type: "plain",
                    value: this.bucketName,
                },
            },
            permissions: {
                "s3:*": [this.bucketArn, `${this.bucketArn}/*`],
            },
        };
    }
    createBucket() {
        const { name, cors, blockPublicACLs, cdk } = this.props;
        if (isCDKConstruct(cdk?.bucket)) {
            if (cors !== undefined) {
                throw new Error(`Cannot configure the "cors" when "cdk.bucket" is a construct`);
            }
            this.cdk.bucket = cdk?.bucket;
        }
        else {
            this.cdk.bucket = new CDKBucket(this, "Bucket", {
                bucketName: name,
                cors: this.buildCorsConfig(cors),
                blockPublicAccess: this.buildBlockPublicAccessConfig(blockPublicACLs),
                objectOwnership: this.buildObjectOwnershipConfig(blockPublicACLs),
                enforceSSL: true,
                ...cdk?.bucket,
            });
        }
    }
    addNotification(scope, notificationName, notification) {
        if (notification instanceof Queue ||
            notification.queue) {
            notification = notification;
            this.addQueueNotification(scope, notificationName, notification);
        }
        else if (notification instanceof Topic ||
            notification.topic) {
            notification = notification;
            this.addTopicNotification(scope, notificationName, notification);
        }
        else {
            notification = notification;
            this.addFunctionNotification(scope, notificationName, notification);
        }
    }
    addQueueNotification(_scope, notificationName, notification) {
        // Parse notification props
        let notificationProps;
        let queue;
        if (notification instanceof Queue) {
            notification = notification;
            queue = notification;
        }
        else {
            notification = notification;
            notificationProps = {
                events: notification.events,
                filters: notification.filters,
            };
            queue = notification.queue;
        }
        this.notifications[notificationName] = queue;
        // Create Notifications
        const events = notificationProps?.events || [
            "object_created",
            "object_removed",
        ];
        const filters = notificationProps?.filters || [];
        events.forEach((event) => this.cdk.bucket.addEventNotification(EventType[event.toUpperCase()], new SqsDestination(queue.cdk.queue), ...filters));
    }
    addTopicNotification(_scope, notificationName, notification) {
        // Parse notification props
        let notificationProps;
        let topic;
        if (notification instanceof Topic) {
            notification = notification;
            topic = notification;
        }
        else {
            notification = notification;
            notificationProps = {
                events: notification.events,
                filters: notification.filters,
            };
            topic = notification.topic;
        }
        this.notifications[notificationName] = topic;
        // Create Notifications
        const events = notificationProps?.events || [
            "object_created",
            "object_removed",
        ];
        const filters = notificationProps?.filters || [];
        events.forEach((event) => this.cdk.bucket.addEventNotification(EventType[event.toUpperCase()], new SnsDestination(topic.cdk.topic), ...filters));
    }
    addFunctionNotification(scope, notificationName, notification) {
        // parse notification
        let notificationFunction, notificationProps;
        if (notification.function) {
            notification = notification;
            notificationFunction = notification.function;
            notificationProps = {
                events: notification.events,
                filters: notification.filters,
            };
        }
        else {
            notificationFunction = notification;
        }
        // create function
        const fn = Fn.fromDefinition(scope, `Notification_${this.node.id}_${notificationName}`, notificationFunction, this.props.defaults?.function, `The "defaults.function" cannot be applied if an instance of a Function construct is passed in. Make sure to define all the consumers using FunctionProps, so the Table construct can apply the "defaults.function" to them.`);
        this.notifications[notificationName] = fn;
        // create Notifications
        const events = notificationProps?.events || [
            "object_created",
            "object_removed",
        ];
        const filters = notificationProps?.filters || [];
        events.forEach((event) => this.cdk.bucket.addEventNotification(EventType[event.toUpperCase()], new LambdaDestination(fn), ...filters));
        // attached permissions
        this.permissionsAttachedForAllNotifications.forEach((permissions) => fn.attachPermissions(permissions));
        fn.bind(this.bindingForAllNotifications);
    }
    buildCorsConfig(cors) {
        if (cors === false) {
            return;
        }
        if (cors === undefined || cors === true) {
            return [
                {
                    allowedHeaders: ["*"],
                    allowedMethods: [
                        HttpMethods.GET,
                        HttpMethods.PUT,
                        HttpMethods.HEAD,
                        HttpMethods.POST,
                        HttpMethods.DELETE,
                    ],
                    allowedOrigins: ["*"],
                },
            ];
        }
        return cors.map((e) => ({
            allowedMethods: (e.allowedMethods || []).map((method) => HttpMethods[method]),
            allowedOrigins: e.allowedOrigins,
            allowedHeaders: e.allowedHeaders,
            exposedHeaders: e.exposedHeaders,
            id: e.id,
            maxAge: e.maxAge && toCdkDuration(e.maxAge).toSeconds(),
        }));
    }
    buildBlockPublicAccessConfig(config) {
        return config === true
            ? BlockPublicAccess.BLOCK_ALL
            : new BlockPublicAccess({
                blockPublicAcls: false,
                ignorePublicAcls: false,
            });
    }
    buildObjectOwnershipConfig(config) {
        return config === true
            ? ObjectOwnership.BUCKET_OWNER_ENFORCED
            : ObjectOwnership.BUCKET_OWNER_PREFERRED;
    }
}
