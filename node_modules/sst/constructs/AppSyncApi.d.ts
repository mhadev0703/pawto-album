export declare function weakImport(pkg: string): Promise<any>;
import { Construct } from "constructs";
import { Table } from "./Table.js";
import { RDS } from "./RDS.js";
import * as appSyncApiDomain from "./util/appSyncApiDomain.js";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionProps, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Permissions } from "./util/permission.js";
import { Table as CDKTable } from "aws-cdk-lib/aws-dynamodb";
import { IServerlessCluster } from "aws-cdk-lib/aws-rds";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { AwsIamConfig, BaseDataSource, GraphqlApi, GraphqlApiProps, IGraphqlApi, Resolver, ResolverProps } from "aws-cdk-lib/aws-appsync";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IDomain } from "aws-cdk-lib/aws-opensearchservice";
export interface AppSyncApiDomainProps extends appSyncApiDomain.CustomDomainProps {
}
interface AppSyncApiBaseDataSourceProps {
    /**
     * Name of the data source
     */
    name?: string;
    /**
     * Description of the data source
     */
    description?: string;
}
/**
 * Used to define a lambda data source
 *
 * @example
 * ```js
 * new AppSyncApi(stack, "AppSync", {
 *   dataSources: {
 *     lambda: {
 *       type: "function",
 *       function: "src/function.handler"
 *     },
 *   },
 * });
 * ```
 *
 */
export interface AppSyncApiLambdaDataSourceProps extends AppSyncApiBaseDataSourceProps {
    /**
     * String literal to signify that this data source is a function
     */
    type?: "function";
    /**
     * Function definition
     */
    function: FunctionDefinition;
}
/**
 * Used to define a DynamoDB data source
 *
 * @example
 * ```js
 * new AppSyncApi(stack, "AppSync", {
 *   dataSources: {
 *     table: {
 *       type: "table",
 *       table: MyTable
 *     },
 *   },
 * });
 * ```
 */
export interface AppSyncApiDynamoDbDataSourceProps extends AppSyncApiBaseDataSourceProps {
    /**
     * String literal to signify that this data source is a dynamodb table
     */
    type: "dynamodb";
    /**
     * Target table
     */
    table?: Table;
    cdk?: {
        dataSource?: {
            table: CDKTable;
        };
    };
}
/**
 * Used to define a RDS data source
 *
 * @example
 * ```js
 * new AppSyncApi(stack, "AppSync", {
 *   dataSources: {
 *     rds: {
 *       type: "rds",
 *       rds: myRDSCluster
 *     },
 *   },
 * });
 * ```
 */
export interface AppSyncApiRdsDataSourceProps extends AppSyncApiBaseDataSourceProps {
    /**
     * String literal to signify that this data source is an RDS database
     */
    type: "rds";
    /**
     * Target RDS construct
     */
    rds?: RDS;
    /**
     * The name of the database to connect to
     */
    databaseName?: string;
    cdk?: {
        dataSource?: {
            serverlessCluster: IServerlessCluster;
            secretStore: ISecret;
            databaseName?: string;
        };
    };
}
/**
 * Used to define a OpenSearch data source
 *
 * @example
 * ```js
 * new AppSyncApi(stack, "AppSync", {
 *   dataSources: {
 *     search: {
 *       type: "open_search",
 *       cdk: {
 *         dataSource: {
 *           domain: myOpenSearchDomain,
 *         }
 *       }
 *     }
 *   }
 * });
 * ```
 */
export interface AppSyncApiOpenSearchDataSourceProps extends AppSyncApiBaseDataSourceProps {
    /**
     * String literal to signify that this data source is an OpenSearch domain
     */
    type: "open_search";
    cdk: {
        dataSource: {
            domain: IDomain;
        };
    };
}
/**
 * Used to define an http data source
 *
 * @example
 * ```js
 * new AppSyncApi(stack, "AppSync", {
 *   dataSources: {
 *     http: {
 *       type: "http",
 *       endpoint: "https://example.com"
 *     },
 *   },
 * });
 * ```
 */
export interface AppSyncApiHttpDataSourceProps extends AppSyncApiBaseDataSourceProps {
    /**
     * String literal to signify that this data source is an HTTP endpoint
     */
    type: "http";
    /**
     * URL to forward requests to
     */
    endpoint: string;
    cdk?: {
        dataSource?: {
            authorizationConfig?: AwsIamConfig;
        };
    };
}
/**
 * Used to define a none data source
 *
 * @example
 * ```js
 * new AppSyncApi(stack, "AppSync", {
 *   dataSources: {
 *     none: {
 *       type: "none",
 *     },
 *   },
 * });
 * ```
 */
export interface AppSyncApiNoneDataSourceProps extends AppSyncApiBaseDataSourceProps {
    /**
     * String literal to signify that this data source is an HTTP endpoint
     */
    type: "none";
}
export interface MappingTemplateFile {
    /**
     * Path to the file containing the VTL mapping template
     */
    file: string;
}
export interface MappingTemplateInline {
    /**
     * Inline definition of the VTL mapping template
     */
    inline: string;
}
export type MappingTemplate = MappingTemplateFile | MappingTemplateInline;
/**
 * Used to define full resolver config
 */
export interface AppSyncApiResolverProps {
    /**
     * The data source for this resolver. The data source must be already created.
     */
    dataSource?: string;
    /**
     * The function definition used to create the data source for this resolver.
     */
    function?: FunctionDefinition;
    /**
     * VTL request mapping template
     *
     * @example
     * ```js
     *   requestMapping: {
     *     inline: '{"version" : "2017-02-28", "operation" : "Scan"}',
     *   },
     * ```
     *
     * @example
     * ```js
     *   requestMapping: {
     *     file: "path/to/template.vtl",
     *   },
     * ```
     */
    requestMapping?: MappingTemplate;
    /**
     * VTL response mapping template
     *
     * @example
     * ```js
     *   responseMapping: {
     *     inline: "$util.toJson($ctx.result.items)",
     *   },
     * ```
     *
     * @example
     * ```js
     *   responseMapping: {
     *     file: "path/to/template.vtl",
     *   },
     * ```
     */
    responseMapping?: MappingTemplate;
    cdk?: {
        /**
         * This allows you to override the default settings this construct uses internally to create the resolver.
         */
        resolver: Omit<ResolverProps, "api" | "fieldName" | "typeName" | "dataSource">;
    };
}
export interface AppSyncApiProps {
    /**
     * The GraphQL schema definition.
     *
     * @example
     *
     * ```js
     * new AppSyncApi(stack, "GraphqlApi", {
     *   schema: "graphql/schema.graphql",
     * });
     * ```
     */
    schema?: string | string[];
    /**
     * Specify a custom domain to use in addition to the automatically generated one. SST currently supports domains that are configured using [Route 53](https://aws.amazon.com/route53/)
     *
     * @example
     * ```js
     * new AppSyncApi(stack, "GraphqlApi", {
     *   customDomain: "api.example.com"
     * })
     * ```
     *
     * @example
     * ```js
     * new AppSyncApi(stack, "GraphqlApi", {
     *   customDomain: {
     *     domainName: "api.example.com",
     *     hostedZone: "domain.com",
     *   }
     * })
     * ```
     */
    customDomain?: string | AppSyncApiDomainProps;
    /**
     * Define datasources. Can be a function, dynamodb table, rds cluster or http endpoint
     *
     * @example
     * ```js
     * new AppSyncApi(stack, "GraphqlApi", {
     *   dataSources: {
     *     notes: "src/notes.main",
     *   },
     *   resolvers: {
     *     "Query    listNotes": "notes",
     *   },
     * });
     * ```
     */
    dataSources?: Record<string, FunctionInlineDefinition | AppSyncApiLambdaDataSourceProps | AppSyncApiDynamoDbDataSourceProps | AppSyncApiRdsDataSourceProps | AppSyncApiOpenSearchDataSourceProps | AppSyncApiHttpDataSourceProps | AppSyncApiNoneDataSourceProps>;
    /**
     * The resolvers for this API. Takes an object, with the key being the type name and field name as a string and the value is either a string with the name of existing data source.
     *
     * @example
     * ```js
     * new AppSyncApi(stack, "GraphqlApi", {
     *   resolvers: {
     *     "Query    listNotes": "src/list.main",
     *     "Query    getNoteById": "src/get.main",
     *     "Mutation createNote": "src/create.main",
     *     "Mutation updateNote": "src/update.main",
     *     "Mutation deleteNote": "src/delete.main",
     *   },
     * });
     * ```
     */
    resolvers?: Record<string, string | FunctionInlineDefinition | AppSyncApiResolverProps>;
    defaults?: {
        /**
         * The default function props to be applied to all the Lambda functions in the AppSyncApi. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         * ```js
         * new AppSync(stack, "AppSync", {
         *   defaults: {
         *     function: {
         *       timeout: 20,
         *       environment: { tableName: table.tableName },
         *       permissions: [table],
         *     }
         *   },
         * });
         * ```
         */
        function?: FunctionProps;
    };
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Allows you to override default settings this construct uses internally to create the AppSync API.
         */
        graphqlApi?: IGraphqlApi | AppSyncApiCdkGraphqlProps;
    };
}
export interface AppSyncApiCdkGraphqlProps extends Omit<GraphqlApiProps, "name" | "schema"> {
    name?: string;
}
/**
 *
 * The `AppSyncApi` construct is a higher level CDK construct that makes it easy to create an AppSync GraphQL API.
 *
 * @example
 *
 * ```js
 * import { AppSyncApi } from "sst/constructs";
 *
 * new AppSyncApi(stack, "GraphqlApi", {
 *   schema: "graphql/schema.graphql",
 *   dataSources: {
 *     notesDS: "src/notes.main",
 *   },
 *   resolvers: {
 *     "Query    listNotes": "notesDS",
 *     "Query    getNoteById": "notesDS",
 *     "Mutation createNote": "notesDS",
 *     "Mutation updateNote": "notesDS",
 *     "Mutation deleteNote": "notesDS",
 *   },
 * });
 * ```
 */
export declare class AppSyncApi extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created appsync api
         */
        graphqlApi: GraphqlApi;
        /**
         * If custom domain is enabled, this is the internally created CDK Certificate instance.
         */
        certificate?: ICertificate;
    };
    private readonly props;
    private _customDomainUrl?;
    private readonly functionsByDsKey;
    private readonly dataSourcesByDsKey;
    private readonly dsKeysByResKey;
    private readonly resolversByResKey;
    private readonly bindingForAllFunctions;
    private readonly permissionsAttachedForAllFunctions;
    constructor(scope: Construct, id: string, props: AppSyncApiProps);
    /**
     * The Id of the internally created AppSync GraphQL API.
     */
    get apiId(): string;
    /**
     * The ARN of the internally created AppSync GraphQL API.
     */
    get apiArn(): string;
    /**
     * The name of the internally created AppSync GraphQL API.
     */
    get apiName(): string;
    /**
     * The AWS generated URL of the Api.
     */
    get url(): string;
    /**
     * If custom domain is enabled, this is the custom domain URL of the Api.
     */
    get customDomainUrl(): string | undefined;
    /**
     * Add data sources after the construct has been created
     *
     * @example
     * ```js
     * api.addDataSources(stack, {
     *   billingDS: "src/billing.main",
     * });
     * ```
     */
    addDataSources(scope: Construct, dataSources: {
        [key: string]: FunctionInlineDefinition | AppSyncApiLambdaDataSourceProps | AppSyncApiDynamoDbDataSourceProps | AppSyncApiRdsDataSourceProps | AppSyncApiOpenSearchDataSourceProps | AppSyncApiHttpDataSourceProps | AppSyncApiNoneDataSourceProps;
    }): void;
    /**
     * Add resolvers the construct has been created
     *
     * @example
     * ```js
     * api.addResolvers(stack, {
     *   "Mutation charge": "billingDS",
     * });
     * ```
     */
    addResolvers(scope: Construct, resolvers: {
        [key: string]: FunctionInlineDefinition | AppSyncApiResolverProps;
    }): void;
    /**
     * Get the instance of the internally created Function, for a given resolver.
     *
     * @example
     * ```js
     * const func = api.getFunction("Mutation charge");
     * ```
     */
    getFunction(key: string): Fn | undefined;
    /**
     * Get a datasource by name
     * @example
     * ```js
     * api.getDataSource("billingDS");
     * ```
     */
    getDataSource(key: string): BaseDataSource | undefined;
    /**
     * Get a resolver
     *
     * @example
     * ```js
     * api.getResolver("Mutation charge");
     * ```
     */
    getResolver(key: string): Resolver | undefined;
    /**
     * Binds the given list of resources to all function data sources.
     *
     * @example
     *
     * ```js
     * api.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Binds the given list of resources to a specific function data source.
     *
     * @example
     * ```js
     * api.bindToDataSource("Mutation charge", [STRIPE_KEY, bucket]);
     * ```
     *
     */
    bindToDataSource(key: string, constructs: SSTConstruct[]): void;
    /**
     * Attaches the given list of permissions to all function data sources
     *
     * @example
     * ```js
     * api.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Attaches the given list of permissions to a specific function datasource. This allows that function to access other AWS resources.
     *
     * @example
     * ```js
     * api.attachPermissionsToDataSource("Mutation charge", ["s3"]);
     * ```
     */
    attachPermissionsToDataSource(key: string, permissions: Permissions): void;
    getConstructMetadata(): {
        type: "AppSync";
        data: {
            url: string;
            appSyncApiId: string;
            appSyncApiKey: string | undefined;
            customDomainUrl: string | undefined;
            dataSources: {
                name: string;
                fn: {
                    node: string;
                    stack: string;
                } | undefined;
            }[];
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps | undefined;
    private createGraphApi;
    private addDataSource;
    private addResolver;
    private isLambdaResolverProps;
    private isDataSourceResolverProps;
    private normalizeResolverKey;
    private buildMappingTemplate;
    private buildDataSourceKey;
    private isSameStack;
}
export {};
