import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { getFunctionRef, isCDKConstruct } from "./Construct.js";
import { Function as Fn, } from "./Function.js";
import { toCdkDuration } from "./util/duration.js";
/////////////////////
// Construct
/////////////////////
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
export class Queue extends Construct {
    id;
    cdk;
    /**
     * The internally created consumer `Function` instance.
     */
    consumerFunction;
    bindingForAllConsumers = [];
    permissionsAttachedForAllConsumers = [];
    props;
    constructor(scope, id, props) {
        super(scope, props?.cdk?.id || id);
        this.id = id;
        this.props = props || {};
        this.cdk = {};
        this.createQueue();
        if (props?.consumer) {
            this.addConsumer(this, props.consumer);
        }
        const app = this.node.root;
        app.registerTypes(this);
    }
    /**
     * The ARN of the SQS Queue
     */
    get queueArn() {
        return this.cdk.queue.queueArn;
    }
    /**
     * The URL of the SQS Queue
     */
    get queueUrl() {
        return this.cdk.queue.queueUrl;
    }
    /**
     * The name of the SQS Queue
     */
    get queueName() {
        return this.cdk.queue.queueName;
    }
    /**
     * Adds a consumer after creating the queue. Note only one consumer can be added to a queue
     *
     * @example
     * ```js {3}
     * const queue = new Queue(stack, "Queue");
     * queue.addConsumer(props.stack, "src/function.handler");
     * ```
     */
    addConsumer(scope, consumer) {
        if (this.consumerFunction) {
            throw new Error("Cannot configure more than 1 consumer for a Queue");
        }
        if (consumer.cdk?.function) {
            consumer = consumer;
            this.addCdkFunctionConsumer(scope, consumer);
        }
        else {
            consumer = consumer;
            this.addFunctionConsumer(scope, consumer);
        }
    }
    addCdkFunctionConsumer(scope, consumer) {
        // Parse target props
        const eventSourceProps = consumer.cdk?.eventSource;
        const fn = consumer.cdk.function;
        // Create target
        fn.addEventSource(new lambdaEventSources.SqsEventSource(this.cdk.queue, eventSourceProps));
        this.consumerFunction = fn;
    }
    addFunctionConsumer(scope, consumer) {
        // Parse consumer props
        let eventSourceProps;
        let functionDefinition;
        if (consumer.function) {
            consumer = consumer;
            eventSourceProps = consumer.cdk?.eventSource;
            functionDefinition = consumer.function;
        }
        else {
            consumer = consumer;
            functionDefinition = consumer;
        }
        // Create function
        const fn = Fn.fromDefinition(scope, `Consumer_${this.node.id}`, functionDefinition);
        fn.addEventSource(new lambdaEventSources.SqsEventSource(this.cdk.queue, eventSourceProps));
        // Attach permissions
        this.permissionsAttachedForAllConsumers.forEach((permissions) => {
            fn.attachPermissions(permissions);
        });
        fn.bind(this.bindingForAllConsumers);
        this.consumerFunction = fn;
    }
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
    bind(constructs) {
        if (this.consumerFunction instanceof Fn) {
            this.consumerFunction.bind(constructs);
        }
        this.bindingForAllConsumers.push(...constructs);
    }
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
    attachPermissions(permissions) {
        if (this.consumerFunction instanceof Fn) {
            this.consumerFunction.attachPermissions(permissions);
        }
        this.permissionsAttachedForAllConsumers.push(permissions);
    }
    getConstructMetadata() {
        return {
            type: "Queue",
            data: {
                name: this.cdk.queue.queueName,
                url: this.cdk.queue.queueUrl,
                consumer: getFunctionRef(this.consumerFunction),
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        return {
            clientPackage: "queue",
            variables: {
                queueUrl: {
                    type: "plain",
                    value: this.queueUrl,
                },
            },
            permissions: {
                "sqs:*": [this.queueArn],
            },
        };
    }
    createQueue() {
        const { cdk } = this.props;
        const root = this.node.root;
        const id = this.node.id;
        if (isCDKConstruct(cdk?.queue)) {
            this.cdk.queue = cdk?.queue;
        }
        else {
            const sqsQueueProps = cdk?.queue || {};
            // If debugIncreaseTimeout is enabled (ie. sst start):
            // - Set visibilityTimeout to > 900s. This is because Lambda timeout is
            //   set to 900s, and visibilityTimeout has to be greater or equal to it.
            //   This will give people more time to debug the function without timing
            //   out the request.
            let debugOverrideProps;
            if (root.debugIncreaseTimeout) {
                if (!sqsQueueProps.visibilityTimeout ||
                    sqsQueueProps.visibilityTimeout.toSeconds() < 900) {
                    debugOverrideProps = {
                        visibilityTimeout: toCdkDuration("900 seconds"),
                    };
                }
            }
            const name = root.logicalPrefixedName(id) + (sqsQueueProps.fifo ? ".fifo" : "");
            this.cdk.queue = new sqs.Queue(this, "Queue", {
                queueName: name,
                ...sqsQueueProps,
                ...debugOverrideProps,
            });
        }
    }
}
