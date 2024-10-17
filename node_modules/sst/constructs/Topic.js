import { Topic as AWSTopic, } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription, SqsSubscription, } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { getFunctionRef, isCDKConstruct, isCDKConstructOf, } from "./Construct.js";
import { Function as Fn, } from "./Function.js";
import { Queue } from "./Queue.js";
/////////////////////
// Construct
/////////////////////
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
export class Topic extends Construct {
    id;
    cdk;
    subscribers = {};
    bindingForAllSubscribers = [];
    permissionsAttachedForAllSubscribers = [];
    props;
    constructor(scope, id, props) {
        super(scope, props?.cdk?.id || id);
        this.id = id;
        this.props = props || {};
        this.cdk = {};
        this.createTopic();
        this.addSubscribers(this, props?.subscribers || {});
        const app = this.node.root;
        app.registerTypes(this);
    }
    /**
     * The ARN of the internally created SNS Topic.
     */
    get topicArn() {
        return this.cdk.topic.topicArn;
    }
    /**
     * The name of the internally created SNS Topic.
     */
    get topicName() {
        return this.cdk.topic.topicName;
    }
    /**
     * Get a list of subscriptions for this topic
     */
    get subscriptions() {
        return Object.values(this.subscribers).map((sub) => {
            let children;
            // look for sns.Subscription inside Queue.sqsQueue
            if (sub instanceof Queue) {
                children = sub.cdk.queue.node.children;
            }
            // look for sns.Subscription inside Function
            else {
                children = sub.node.children;
            }
            const child = children.find((child) => {
                return isCDKConstructOf(child, "aws-cdk-lib.aws_sns.Subscription");
            });
            return child;
        });
    }
    /**
     * A list of the internally created function instances for the subscribers.
     */
    get subscriberFunctions() {
        return Object.values(this.subscribers).filter((subscriber) => subscriber instanceof Fn);
    }
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
    addSubscribers(scope, subscribers) {
        Object.entries(subscribers).forEach(([subscriberName, subscriber]) => {
            this.addSubscriber(scope, subscriberName, subscriber);
        });
    }
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
    bind(constructs) {
        Object.values(this.subscribers)
            .filter((subscriber) => subscriber instanceof Fn)
            .forEach((subscriber) => subscriber.bind(constructs));
        this.bindingForAllSubscribers.push(...constructs);
    }
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
    bindToSubscriber(subscriberName, constructs) {
        const subscriber = this.subscribers[subscriberName];
        if (!(subscriber instanceof Fn)) {
            throw new Error(`Cannot bind to the "${this.node.id}" Topic subscriber because it's not a Lambda function`);
        }
        subscriber.bind(constructs);
    }
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
    attachPermissions(permissions) {
        Object.values(this.subscribers)
            .filter((subscriber) => subscriber instanceof Fn)
            .forEach((subscriber) => subscriber.attachPermissions(permissions));
        this.permissionsAttachedForAllSubscribers.push(permissions);
    }
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
    attachPermissionsToSubscriber(subscriberName, permissions) {
        const subscriber = this.subscribers[subscriberName];
        if (!(subscriber instanceof Fn)) {
            throw new Error(`Cannot attach permissions to the "${this.node.id}" Topic subscriber because it's not a Lambda function`);
        }
        subscriber.attachPermissions(permissions);
    }
    getConstructMetadata() {
        return {
            type: "Topic",
            data: {
                topicArn: this.cdk.topic.topicArn,
                // TODO: Deprecate eventually and mirror KinesisStream
                subscribers: Object.values(this.subscribers).map(getFunctionRef),
                subscriberNames: Object.keys(this.subscribers),
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        return {
            clientPackage: "topic",
            variables: {
                topicArn: {
                    type: "plain",
                    value: this.topicArn,
                },
            },
            permissions: {
                "sns:*": [this.topicArn],
            },
        };
    }
    createTopic() {
        const app = this.node.root;
        const { cdk } = this.props;
        if (isCDKConstruct(cdk?.topic)) {
            this.cdk.topic = cdk?.topic;
        }
        else {
            const snsTopicProps = (cdk?.topic || {});
            this.cdk.topic = new AWSTopic(this, "Topic", {
                topicName: app.logicalPrefixedName(this.node.id),
                ...snsTopicProps,
            });
        }
    }
    addSubscriber(scope, subscriberName, subscriber) {
        if (subscriber instanceof Queue ||
            subscriber.queue) {
            subscriber = subscriber;
            this.addQueueSubscriber(scope, subscriberName, subscriber);
        }
        else {
            subscriber = subscriber;
            this.addFunctionSubscriber(scope, subscriberName, subscriber);
        }
    }
    addQueueSubscriber(_scope, subscriberName, subscriber) {
        // Parse subscriber props
        let subscriptionProps;
        let queue;
        if (subscriber instanceof Queue) {
            subscriber = subscriber;
            queue = subscriber;
        }
        else {
            subscriber = subscriber;
            subscriptionProps = subscriber.cdk?.subscription;
            queue = subscriber.queue;
        }
        this.subscribers[subscriberName] = queue;
        // Create Subscription
        this.cdk.topic.addSubscription(new SqsSubscription(queue.cdk.queue, subscriptionProps));
    }
    addFunctionSubscriber(scope, subscriberName, subscriber) {
        // Parse subscriber props
        let subscriptionProps;
        let functionDefinition;
        if (typeof subscriber !== "string" && "function" in subscriber) {
            subscriptionProps = subscriber.cdk?.subscription;
            functionDefinition = subscriber.function;
        }
        else {
            subscriber = subscriber;
            functionDefinition = subscriber;
        }
        // Create function
        const fn = Fn.fromDefinition(scope, `Subscriber_${this.node.id}_${subscriberName}`, functionDefinition, this.props.defaults?.function, `The "defaults.function" cannot be applied if an instance of a Function construct is passed in. Make sure to define all the subscribers using FunctionProps, so the Topic construct can apply the "defaults.function" to them.`);
        this.subscribers[subscriberName] = fn;
        // Create Subscription
        this.cdk.topic.addSubscription(new LambdaSubscription(fn, subscriptionProps));
        // Attach existing permissions
        this.permissionsAttachedForAllSubscribers.forEach((permissions) => fn.attachPermissions(permissions));
        fn.bind(this.bindingForAllSubscribers);
    }
}
