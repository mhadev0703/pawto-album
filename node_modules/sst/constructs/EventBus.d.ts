import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import { LambdaFunctionProps as LambdaFunctionTargetProps, SqsQueueProps as SqsQueueTargetProps, LogGroupProps as LogGroupTargetProps } from "aws-cdk-lib/aws-events-targets";
import { ILogGroup } from "aws-cdk-lib/aws-logs";
import { Queue } from "./Queue.js";
import { SSTConstruct } from "./Construct.js";
import { FunctionProps, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Permissions } from "./util/permission.js";
/**
 * Used to configure an EventBus function target
 * @example
 * ```js
 * new EventBus(stack, "Bus", {
 *   rules: {
 *     myRule: {
 *       targets: {
 *         myTarget: { function: "src/function.handler" },
 *       }
 *     },
 *   },
 * });
 * ```
 */
export interface EventBusFunctionTargetProps {
    /**
     * String literal to signify that the target is a function
     */
    type?: "function";
    /**
     * The function to trigger
     */
    function?: FunctionDefinition;
    /**
     * Number of retries
     */
    retries?: number;
    cdk?: {
        function?: lambda.IFunction;
        target?: LambdaFunctionTargetProps;
    };
}
/**
 * Used to configure an EventBus queue target
 * @example
 * ```js
 * new EventBus(stack, "Bus", {
 *   rules: {
 *     myRule: {
 *       targets: {
 *         myTarget: {
 *           type: "queue",
 *           queue: new Queue(stack, "Queue")
 *         }
 *       }
 *     },
 *   },
 * });
 * ```
 */
export interface EventBusQueueTargetProps {
    /**
     * String literal to signify that the target is a queue
     */
    type: "queue";
    /**
     * The queue to trigger
     */
    queue: Queue;
    cdk?: {
        target?: SqsQueueTargetProps;
    };
}
/**
 * Used to configure an EventBus log group target
 * @example
 * ```js
 * new EventBus(stack, "Bus", {
 *   rules: {
 *     myRule: {
 *       targets: {
 *         myTarget: {
 *           type: "log_group",
 *           cdk: {
 *            logGroup: LogGroup.fromLogGroupName(stack, "Logs", "/my/target/log"),
 *           }
 *         }
 *       }
 *     },
 *   },
 * });
 * ```
 */
export interface EventBusLogGroupTargetProps {
    /**
     * String literal to signify that the target is a log group
     */
    type: "log_group";
    cdk: {
        logGroup: ILogGroup;
        target?: LogGroupTargetProps;
    };
}
/**
 * Used to configure an EventBus rule
 */
export interface EventBusRuleProps {
    pattern?: {
        /**
         * A list of sources to filter on
         *
         * @example
         * ```js
         * new EventBus(stack, "Bus", {
         *   rules: {
         *     myRule: {
         *       pattern: { source: ["myevent"] },
         *     },
         *   },
         * });
         * ```
         */
        source?: string[];
        /**
         * Fields to match on the detail field
         *
         * @example
         * ```js
         * new EventBus(stack, "Bus", {
         *   rules: {
         *     myRule: {
         *       pattern: { detail: { FOO: 1 }  },
         *     },
         *   },
         * });
         * ```
         */
        detail?: {
            [key: string]: any;
        };
        /**
         * A list of detailTypes to filter on
         *
         * @example
         * ```js
         * new EventBus(stack, "Bus", {
         *   rules: {
         *     myRule: {
         *       pattern: { detailType: ["foo"]  },
         *     },
         *   },
         * });
         * ```
         */
        detailType?: string[];
    };
    /**
     * Configure targets for this rule.
     *
     * @example
     * ```js
     * new EventBus(stack, "Bus", {
     *   rules: {
     *     myRule: {
     *       targets: {
     *         myTarget1: "src/function.handler",
     *         myTarget2: new Queue(stack, "MyQueue"),
     *       }
     *     },
     *   },
     * });
     * ```
     */
    targets?: Record<string, FunctionInlineDefinition | EventBusFunctionTargetProps | Queue | EventBusQueueTargetProps | EventBusLogGroupTargetProps>;
    cdk?: {
        /**
         * Configure the internally created CDK `Rule` instance.
         *
         * @example
         * ```js {5-8}
         * new EventBus(stack, "Bus", {
         *   rules: {
         *     myRule: {
         *       cdk: {
         *         rule: {
         *           ruleName: "my-rule",
         *           enabled: false,
         *         },
         *       },
         *       targets: {
         *         myTarget1: "src/lambda.handler",
         *       },
         *     },
         *   },
         * });
         * ```
         */
        rule?: Omit<events.RuleProps, "eventBus" | "targets">;
    };
}
export interface EventBusProps {
    defaults?: {
        /**
         * The default function props to be applied to all the Lambda functions in the EventBus. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         * ```js
         * new EventBus(stack, "Bus", {
         *   defaults: {
         *     function: {
         *       timeout: 20,
         *     }
         *   },
         * });
         * ```
         */
        function?: FunctionProps;
        /**
         * Enable retries with exponential backoff for all lambda function targets in this eventbus
         *
         * @example
         * ```js
         * new EventBus(stack, "Bus", {
         *   retries: 20
         * });
         * ```
         */
        retries?: number;
    };
    /**
     * The rules for the eventbus
     *
     * @example
     * ```js {5}
     * new EventBus(stack, "Bus", {
     *   rules: {
     *     myRule: {
     *       pattern: { source: ["myevent"] },
     *       targets: {
     *         myTarget: "src/function.handler"
     *       },
     *     },
     *   },
     * });
     * ```
     */
    rules?: Record<string, EventBusRuleProps>;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Override the internally created EventBus
         * @example
         * ```js
         * new EventBus(stack, "Bus", {
         *   cdk: {
         *     eventBus: {
         *       eventBusName: "MyEventBus",
         *     },
         *   }
         * });
         * ```
         */
        eventBus?: events.IEventBus | events.EventBusProps;
    };
}
/**
 * The `EventBus` construct is a higher level CDK construct that makes it easy to create an EventBridge Event Bus.
 *
 * @example
 *
 * ```js
 * import { EventBus } from "sst/constructs";
 *
 * new EventBus(stack, "Bus", {
 *   rules: {
 *     myRule: {
 *       pattern: { source: ["myevent"] },
 *       targets: {
 *         myTarget1: "src/function1.handler",
 *         myTarget2: "src/function2.handler"
 *       },
 *     },
 *   },
 * });
 * ```
 */
export declare class EventBus extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created CDK `EventBus` instance.
         */
        eventBus: events.IEventBus;
    };
    private readonly rulesData;
    private readonly targetsData;
    private readonly bindingForAllTargets;
    private readonly permissionsAttachedForAllTargets;
    private readonly props;
    constructor(scope: Construct, id: string, props?: EventBusProps);
    /**
     * The ARN of the internally created `EventBus` instance.
     */
    get eventBusArn(): string;
    /**
     * The name of the internally created `EventBus` instance.
     */
    get eventBusName(): string;
    /**
     * Get a rule
     *
     * @example
     * ```js
     * bus.getRule("myRule");
     * ```
     */
    getRule(key: string): events.Rule | undefined;
    /**
     * Add rules after the EventBus has been created.
     *
     * @example
     * ```js
     * bus.addRules(stack, {
     *   myRule2: {
     *     pattern: { source: ["myevent"] },
     *       targets: {
     *         myTarget3: "src/function3.handler"
     *         myTarget4: "src/function4.handler"
     *       },
     *   },
     * });
     * ```
     */
    addRules(scope: Construct, rules: Record<string, EventBusRuleProps>): void;
    /**
     * Add targets to existing rules.
     *
     * @example
     * ```js
     * bus.addRules(stack, "myRule", {
     *   myTarget1: "src/function1.handler"
     *   myTarget2: "src/function2.handler"
     * });
     * ```
     */
    addTargets(scope: Construct, ruleKey: string, targets: Record<string, FunctionInlineDefinition | EventBusFunctionTargetProps | Queue | EventBusQueueTargetProps | EventBusLogGroupTargetProps>): void;
    /**
     * Binds the given list of resources to all event targets in this EventBus.
     *
     * @example
     * ```js
     * bus.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Binds the given list of resources to a specific event bus rule target
     *
     * @example
     * ```js
     * const bus = new EventBus(stack, "Bus", {
     *   rules: {
     *     myRule: {
     *       pattern: { source: ["myevent"] },
     *       targets: {
     *         myTarget1: "src/function1.handler"
     *         myTarget2: "src/function2.handler"
     *       },
     *     },
     *   },
     * });
     *
     * bus.bindToTarget("myRule", 0, [STRIPE_KEY, bucket]);
     * ```
     */
    bindToTarget(ruleKey: string, targetName: string, constructs: SSTConstruct[]): void;
    /**
     * Add permissions to all event targets in this EventBus.
     *
     * @example
     * ```js
     * bus.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Add permissions to a specific event bus rule target
     *
     * @example
     * ```js
     * const bus = new EventBus(stack, "Bus", {
     *   rules: {
     *     myRule: {
     *       pattern: { source: ["myevent"] },
     *       targets: {
     *         myTarget1: "src/function1.handler"
     *         myTarget2: "src/function2.handler"
     *       },
     *     },
     *   },
     * });
     *
     * bus.attachPermissionsToTarget("myRule", 0, ["s3"]);
     * ```
     */
    attachPermissionsToTarget(ruleKey: string, targetName: string, permissions: Permissions): void;
    getConstructMetadata(): {
        type: "EventBus";
        data: {
            eventBusName: string;
            rules: {
                key: string;
                targets: ({
                    node: string;
                    stack: string;
                } | undefined)[];
                targetNames: string[];
            }[];
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    private retrierQueue;
    private retrierFn;
    private getRetrier;
    private createEventBus;
    private addRule;
    private addTarget;
    private addQueueTarget;
    private addLogGroupTarget;
    private addCdkFunctionTarget;
    private subs;
    subscribe(type: string | string[], target: FunctionDefinition, props?: {
        retries?: number;
    }): EventBus;
    subscribe(scope: Construct, type: string | string[], target: FunctionDefinition, props?: {
        retries?: number;
    }): EventBus;
    private addFunctionTarget;
}
