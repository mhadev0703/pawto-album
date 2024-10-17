import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionProps, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { KinesisStream } from "./KinesisStream.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Permissions } from "./util/permission.js";
export interface TableConsumerProps {
    /**
     * Used to create the consumer function for the table.
     */
    function: FunctionDefinition;
    /**
     * Used to filter the records that are passed to the consumer function.
     * @example
     * ```js
     * const table = new Table(stack, "Table", {
     *   consumers: {
     *     myConsumer: {
     *       function: "src/consumer1.main",
     *       filters: [
     *         {
     *           dynamodb: {
     *             Keys: {
     *               Id: {
     *                 N: ["101"]
     *               }
     *             }
     *           }
     *         }
     *       ]
     *     }
     *   },
     * });
     * ```
     */
    filters?: any[];
    cdk?: {
        /**
         * Override the settings of the internally created event source
         */
        eventSource?: lambdaEventSources.DynamoEventSourceProps;
    };
}
export interface TableLocalIndexProps {
    /**
     * The field that's to be used as the sort key for the index.
     */
    sortKey: string;
    /**
     * The set of attributes that are projected into the secondary index.
     * @default "all"
     */
    projection?: Lowercase<keyof Pick<typeof dynamodb.ProjectionType, "ALL" | "KEYS_ONLY">> | string[];
    cdk?: {
        /**
         * Override the settings of the internally created local secondary indexes
         */
        index?: Omit<dynamodb.LocalSecondaryIndexProps, "indexName" | "sortKey">;
    };
}
export interface TableGlobalIndexProps {
    /**
     * The field that's to be used as a partition key for the index.
     */
    partitionKey: string;
    /**
     * The field that's to be used as the sort key for the index.
     */
    sortKey?: string;
    /**
     * The set of attributes that are projected into the secondary index.
     * @default "all"
     */
    projection?: Lowercase<keyof Pick<typeof dynamodb.ProjectionType, "ALL" | "KEYS_ONLY">> | string[];
    cdk?: {
        /**
         * Override the settings of the internally created global secondary index
         */
        index?: Omit<dynamodb.GlobalSecondaryIndexProps, "indexName" | "partitionKey" | "sortKey">;
    };
}
type TableFieldType = Lowercase<keyof typeof dynamodb.AttributeType>;
export interface TableProps {
    /**
     * An object defining the fields of the table. Key is the name of the field and the value is the type.
     *
     * @example
     * ```js
     * new Table(stack, "Table", {
     *   fields: {
     *     pk: "string",
     *     sk: "string",
     *   }
     * })
     * ```
     */
    fields?: Record<string, TableFieldType>;
    primaryIndex?: {
        /**
         * Define the Partition Key for the table's primary index
         *
         * @example
         *
         * ```js
         * new Table(stack, "Table", {
         *   fields: {
         *     pk: "string",
         *   },
         *   primaryIndex: { partitionKey: "pk" },
         * });
         * ```
         */
        partitionKey: string;
        /**
         * Define the Sort Key for the table's primary index
         *
         * @example
         *
         * ```js
         * new Table(stack, "Table", {
         *   fields: {
         *     pk: "string",
         *     sk: "string",
         *   },
         *   primaryIndex: { partitionKey: "pk", sortKey: "sk" },
         * });
         * ```
         */
        sortKey?: string;
    };
    /**
     * Configure the table's global secondary indexes
     *
     * @example
     *
     * ```js
     * new Table(stack, "Table", {
     *   fields: {
     *     pk: "string",
     *     sk: "string",
     *     gsi1pk: "string",
     *     gsi1sk: "string",
     *   },
     *   globalIndexes: {
     *     "GSI1": { partitionKey: "gsi1pk", sortKey: "gsi1sk" },
     *   },
     * });
     * ```
     */
    globalIndexes?: Record<string, TableGlobalIndexProps>;
    /**
     * Configure the table's local secondary indexes
     *
     * @example
     *
     * ```js
     * new Table(stack, "Table", {
     *   fields: {
     *     pk: "string",
     *     sk: "string",
     *     lsi1sk: "string",
     *   },
     *   localIndexes: {
     *     "lsi1": { sortKey: "lsi1sk" },
     *   },
     * });
     * ```
     */
    localIndexes?: Record<string, TableLocalIndexProps>;
    /**
     * The field that's used to store the expiration time for items in the table.
     *
     * @example
     * ```js {8}
     * new Table(stack, "Table", {
     *   timeToLiveAttribute: "expireAt",
     * });
     * ```
     */
    timeToLiveAttribute?: string;
    /**
     * Configure the KinesisStream to capture item-level changes for the table.
     *
     * @example
     *
     * ```js
     * const stream = new KinesisStream(stack, "Stream");
     *
     * new Table(stack, "Table", {
     *   kinesisStream: stream,
     * });
     * ```
     */
    kinesisStream?: KinesisStream;
    /**
     * Configure the information that will be written to the Stream.
     *
     * @example
     * ```js {8}
     * new Table(stack, "Table", {
     *   stream: "new_image",
     * });
     * ```
     */
    stream?: boolean | Lowercase<keyof typeof dynamodb.StreamViewType>;
    defaults?: {
        /**
         * The default function props to be applied to all the consumers in the Table. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         *
         * ```js
         * new Table(stack, "Table", {
         *   defaults: {
         *     function: {
         *       timeout: 20,
         *       environment: { topicName: topic.topicName },
         *       permissions: [topic],
         *     }
         *   },
         * });
         * ```
         */
        function?: FunctionProps;
    };
    /**
     * Configure DynamoDB streams and consumers
     *
     * @example
     *
     * ```js
     * const table = new Table(stack, "Table", {
     *   consumers: {
     *     consumer1: "src/consumer1.main",
     *     consumer2: "src/consumer2.main",
     *   },
     * });
     * ```
     */
    consumers?: Record<string, FunctionInlineDefinition | TableConsumerProps>;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Override the settings of the internally created cdk table
         */
        table?: dynamodb.ITable | Omit<dynamodb.TableProps, "partitionKey" | "sortKey">;
    };
}
/**
 * The `Table` construct is a higher level CDK construct that makes it easy to create a DynamoDB table.
 *
 * @example
 *
 * Deploys a plain HTML website in the `path/to/src` directory.
 *
 * ```js
 * import { Table } from "sst/constructs";
 *
 * new Table(stack, "Notes", {
 *   fields: {
 *     userId: "string",
 *     noteId: "string",
 *   },
 *   primaryIndex: { partitionKey: "noteId", sortKey: "userId" },
 * });
 * ```
 */
export declare class Table extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created CDK `Table` instance.
         */
        table: dynamodb.ITable;
    };
    private dynamodbTableType?;
    private functions;
    private bindingForAllConsumers;
    private permissionsAttachedForAllConsumers;
    private props;
    private stream?;
    private fields?;
    constructor(scope: Construct, id: string, props: TableProps);
    /**
     * The ARN of the internally created DynamoDB Table.
     */
    get tableArn(): string;
    /**
     * The name of the internally created DynamoDB Table.
     */
    get tableName(): string;
    /**
     * Add additional global secondary indexes where the `key` is the name of the global secondary index
     *
     * @example
     * ```js
     * table.addGlobalIndexes({
     *   gsi1: {
     *     partitionKey: "pk",
     *     sortKey: "sk",
     *   }
     * })
     * ```
     */
    addGlobalIndexes(secondaryIndexes: NonNullable<TableProps["globalIndexes"]>): void;
    /**
     * Add additional local secondary indexes where the `key` is the name of the local secondary index
     *
     * @example
     * ```js
     * table.addLocalIndexes({
     *   lsi1: {
     *     sortKey: "sk",
     *   }
     * })
     * ```
     */
    addLocalIndexes(secondaryIndexes: NonNullable<TableProps["localIndexes"]>): void;
    /**
     * Define additional consumers for table events
     *
     * @example
     * ```js
     * table.addConsumers(stack, {
     *   consumer1: "src/consumer1.main",
     *   consumer2: "src/consumer2.main",
     * });
     * ```
     */
    addConsumers(scope: Construct, consumers: {
        [consumerName: string]: FunctionInlineDefinition | TableConsumerProps;
    }): void;
    /**
     * Binds the given list of resources to all consumers of this table.
     *
     * @example
     * ```js
     * table.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Binds the given list of resources to a specific consumer of this table.
     *
     * @example
     * ```js
     * table.bindToConsumer("consumer1", [STRIPE_KEY, bucket]);
     * ```
     */
    bindToConsumer(consumerName: string, constructs: SSTConstruct[]): void;
    /**
     * Grant permissions to all consumers of this table.
     *
     * @example
     * ```js
     * table.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Grant permissions to a specific consumer of this table.
     *
     * @example
     * ```js
     * table.attachPermissionsToConsumer("consumer1", ["s3"]);
     * ```
     */
    attachPermissionsToConsumer(consumerName: string, permissions: Permissions): void;
    /**
     * Get the instance of the internally created Function, for a given consumer.
     *
     * ```js
     *  const table = new Table(stack, "Table", {
     *    consumers: {
     *      consumer1: "./src/function.handler",
     *    }
     *  })
     * table.getFunction("consumer1");
     * ```
     */
    getFunction(consumerName: string): Fn | undefined;
    /** @internal */
    getConstructMetadata(): {
        type: "Table";
        data: {
            tableName: string;
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
    private createTable;
    private addConsumer;
    private buildAttribute;
    private buildStreamConfig;
    private buildKinesisStreamSpec;
    private validateFieldsAndIndexes;
}
export {};
