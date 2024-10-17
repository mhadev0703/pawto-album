import { Construct } from "constructs";
import { HttpUrlIntegrationProps, HttpAlbIntegrationProps, HttpNlbIntegrationProps } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpAwsIntegrationProps } from "./cdk/HttpAwsIntegration.js";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionProps, FunctionInlineDefinition, FunctionDefinition } from "./Function.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { Duration } from "./util/duration.js";
import { Permissions } from "./util/permission.js";
import * as apigV2Cors from "./util/apiGatewayV2Cors.js";
import * as apigV2Domain from "./util/apiGatewayV2Domain.js";
import * as apigV2AccessLog from "./util/apiGatewayV2AccessLog.js";
import { DomainName, HttpApi, HttpApiProps, HttpRouteIntegration, HttpStageProps, IHttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpJwtAuthorizer, HttpLambdaAuthorizer, HttpLambdaResponseType, HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { IApplicationListener, INetworkListener } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
declare const PayloadFormatVersions: readonly ["1.0", "2.0"];
export type ApiPayloadFormatVersion = (typeof PayloadFormatVersions)[number];
export interface CdkHttpAwsIntegrationProps extends HttpAwsIntegrationProps {
}
export type ApiAuthorizer = ApiUserPoolAuthorizer | ApiJwtAuthorizer | ApiLambdaAuthorizer;
interface ApiBaseAuthorizer {
    /**
     * The name of the authorizer.
     */
    name?: string;
    /**
     * The identity source for which authorization is requested.
     * @default `["$request.header.Authorization"]`
     */
    identitySource?: string[];
}
/**
 * Specify a user pool authorizer and configure additional options.
 *
 * @example
 * ```js
 * new Api(stack, "Api", {
 *   authorizers: {
 *     Authorizer: {
 *       type: "user_pool",
 *       userPool: {
 *         id: userPool.userPoolId,
 *         clientIds: [userPoolClient.userPoolClientId],
 *       },
 *     },
 *   },
 * });
 * ```
 */
export interface ApiUserPoolAuthorizer extends ApiBaseAuthorizer {
    /**
     * String li any shot and having even a miniscule shotteral to signify that the authorizer is user pool authorizer.
     */
    type: "user_pool";
    userPool?: {
        /**
         * The id of the user pool to use for authorization.
         */
        id: string;
        /**
         * The ids of the user pool clients to use for authorization.
         */
        clientIds?: string[];
        /**
         * The AWS region of the user pool.
         */
        region?: string;
    };
    cdk?: {
        /**
         * This allows you to override the default settings this construct uses internally to create the authorizer.
         */
        authorizer: HttpUserPoolAuthorizer;
    };
}
/**
 * Specify a JWT authorizer and configure additional options.
 *
 * @example
 * ```js
 * new Api(stack, "Api", {
 *   authorizers: {
 *     Authorizer: {
 *       type: "jwt",
 *       userPool: {
 *         issuer: "https://abc.us.auth0.com",
 *         audience: ["123"],
 *       },
 *     },
 *   },
 * });
 * ```
 */
export interface ApiJwtAuthorizer extends ApiBaseAuthorizer {
    /**
     * String literal to signify that the authorizer is JWT authorizer.
     */
    type: "jwt";
    jwt?: {
        /**
         * The base domain of the identity provider that issues JWT.
         */
        issuer: string;
        /**
         * A list of the intended recipients of the JWT.
         */
        audience: string[];
    };
    cdk?: {
        /**
         * This allows you to override the default settings this construct uses internally to create the authorizer.
         */
        authorizer: HttpJwtAuthorizer;
    };
}
/**
 * Specify a Lambda authorizer and configure additional options.
 *
 * @example
 * ```js
 * new Api(stack, "Api", {
 *   authorizers: {
 *     Authorizer: {
 *       type: "lambda",
 *       function: new Function(stack, "Authorizer", {
 *         handler: "test/lambda.handler",
 *       }),
 *     },
 *   },
 * });
 * ```
 */
export interface ApiLambdaAuthorizer extends ApiBaseAuthorizer {
    /**
     * String literal to signify that the authorizer is Lambda authorizer.
     */
    type: "lambda";
    /**
     * Used to create the authorizer function
     */
    function?: Fn;
    /**
     * The types of responses the lambda can return.
     *
     * If `simple` is included then response format 2.0 will be used.
     * @default ["iam"]
     */
    responseTypes?: Lowercase<keyof typeof HttpLambdaResponseType>[];
    /**
     * The amount of time the results are cached.
     * @default Not cached
     */
    resultsCacheTtl?: Duration;
    cdk?: {
        /**
         * This allows you to override the default settings this construct uses internally to create the authorizer.
         */
        authorizer: HttpLambdaAuthorizer;
    };
}
export interface ApiCorsProps extends apigV2Cors.CorsProps {
}
export interface ApiDomainProps extends apigV2Domain.CustomDomainProps {
}
export interface ApiAccessLogProps extends apigV2AccessLog.AccessLogProps {
}
export interface ApiProps<Authorizers extends Record<string, ApiAuthorizer> = Record<string, ApiAuthorizer>, AuthorizerKeys = keyof Authorizers> {
    /**
     * Define the routes for the API. Can be a function, proxy to another API, or point to an load balancer
     *
     * @example
     *
     * ```js
     * new Api(stack, "api", {
     *   routes: {
     *     "GET /notes"      : "src/list.main",
     *     "GET /notes/{id}" : "src/get.main",
     *     "$default": "src/default.main"
     *   }
     * })
     * ```
     */
    routes?: Record<string, ApiRouteProps<AuthorizerKeys>>;
    /**
     * CORS support applied to all endpoints in this API
     *
     * @default true
     *
     * @example
     *
     * ```js
     * new Api(stack, "Api", {
     *   cors: {
     *     allowMethods: ["GET"],
     *   },
     * });
     * ```
     *
     */
    cors?: boolean | ApiCorsProps;
    /**
     * Enable CloudWatch access logs for this API. Defaults to true.
     *
     * @default true
     *
     * @example
     * ```js
     * new Api(stack, "Api", {
     *   accessLog: true
     * });
     * ```
     *
     * ```js
     * new Api(stack, "Api", {
     *   accessLog: {
     *     retention: "one_week",
     *   },
     * });
     * ```
     */
    accessLog?: boolean | string | ApiAccessLogProps;
    /**
     * Specify a custom domain to use in addition to the automatically generated one. SST currently supports domains that are configured using [Route 53](https://aws.amazon.com/route53/)
     *
     * @example
     * ```js
     * new Api(stack, "Api", {
     *   customDomain: "api.example.com"
     * })
     * ```
     *
     * ```js
     * new Api(stack, "Api", {
     *   customDomain: {
     *     domainName: "api.example.com",
     *     hostedZone: "domain.com",
     *     path: "v1"
     *   }
     * })
     * ```
     */
    customDomain?: string | ApiDomainProps;
    /**
     * Define the authorizers for the API. Can be a user pool, JWT, or Lambda authorizers.
     *
     * @example
     * ```js
     * new Api(stack, "Api", {
     *   authorizers: {
     *     Authorizer: {
     *       type: "user_pool",
     *       userPool: {
     *         id: userPool.userPoolId,
     *         clientIds: [userPoolClient.userPoolClientId],
     *       },
     *     },
     *   },
     * });
     * ```
     */
    authorizers?: Authorizers;
    defaults?: {
        /**
         * The default function props to be applied to all the Lambda functions in the API. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         * ```js
         * new Api(stack, "Api", {
         *   defaults: {
         *     function: {
         *       timeout: 20,
         *       environment: { tableName: table.tableName },
         *       permissions: [table],
         *     }
         *   }
         * });
         * ```
         */
        function?: FunctionProps;
        /**
         * The default authorizer for all the routes in the API.
         *
         * @example
         * ```js
         * new Api(stack, "Api", {
         *   defaults: {
         *     authorizer: "iam",
         *   }
         * });
         * ```
         *
         * @example
         * ```js
         * new Api(stack, "Api", {
         *   authorizers: {
         *     Authorizer: {
         *       type: "user_pool",
         *       userPool: {
         *         id: userPool.userPoolId,
         *         clientIds: [userPoolClient.userPoolClientId],
         *       },
         *     },
         *   },
         *   defaults: {
         *     authorizer: "Authorizer",
         *   }
         * });
         * ```
         */
        authorizer?: "none" | "iam" | (string extends AuthorizerKeys ? Omit<AuthorizerKeys, "none" | "iam"> : AuthorizerKeys);
        /**
         * An array of scopes to include in the authorization when using `user_pool` or `jwt` authorizers. These will be merged with the scopes from the attached authorizer.
         * @default []
         */
        authorizationScopes?: string[];
        /**
         * The [payload format version](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format) for all the endpoints in the API.
         * @default "2.0"
         */
        payloadFormatVersion?: ApiPayloadFormatVersion;
        throttle?: {
            /**
             * The [burst rate](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html) of the number of concurrent request for all the routes in the API.
             *
             * @example
             * ```js
             * new Api(stack, "Api", {
             *   defaults: {
             *     throttle: {
             *       burst: 100
             *     }
             *   }
             * })
             * ```
             */
            burst?: number;
            /**
             * The [steady-state rate](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html) of the number of concurrent request for all the routes in the API.
             *
             * @example
             * ```js
             * new Api(stack, "Api", {
             *   defaults: {
             *     throttle: {
             *       rate: 10
             *     }
             *   }
             * })
             * ```
             */
            rate?: number;
        };
    };
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Import the underlying HTTP API or override the default configuration
         *
         * @example
         * ```js
         * import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
         *
         * new Api(stack, "Api", {
         *   cdk: {
         *     httpApi: HttpApi.fromHttpApiAttributes(stack, "MyHttpApi", {
         *       httpApiId,
         *     }),
         *   }
         * });
         * ```
         */
        httpApi?: IHttpApi | HttpApiProps;
        /**
         * Configures the stages to create for the HTTP API.
         *
         * Note that, a default stage is automatically created, unless the `cdk.httpApi.createDefaultStage` is set to `false.
         *
         * @example
         * ```js
         * import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
         *
         * new Api(stack, "Api", {
         *   cdk: {
         *     httpStages: [{
         *       stageName: "dev",
         *       autoDeploy: false,
         *     }],
         *   }
         * });
         * ```
         */
        httpStages?: Omit<HttpStageProps, "httpApi">[];
    };
}
export type ApiRouteProps<AuthorizerKeys> = FunctionInlineDefinition | ApiFunctionRouteProps<AuthorizerKeys> | ApiAwsRouteProps<AuthorizerKeys> | ApiHttpRouteProps<AuthorizerKeys> | ApiAlbRouteProps<AuthorizerKeys> | ApiNlbRouteProps<AuthorizerKeys> | ApiGraphQLRouteProps<AuthorizerKeys>;
interface ApiBaseRouteProps<AuthorizerKeys = string> {
    authorizer?: "none" | "iam" | (string extends AuthorizerKeys ? Omit<AuthorizerKeys, "none" | "iam"> : AuthorizerKeys);
    authorizationScopes?: string[];
}
/**
 * Specify a function route handler and configure additional options
 *
 * @example
 * ```js
 * api.addRoutes(stack, {
 *   "GET /notes/{id}": {
 *     type: "function",
 *     function: "src/get.main",
 *     payloadFormatVersion: "1.0",
 *   }
 * });
 * ```
 */
export interface ApiFunctionRouteProps<AuthorizersKeys = string> extends ApiBaseRouteProps<AuthorizersKeys> {
    type?: "function";
    /**
     *The function definition used to create the function for this route.
     */
    function?: FunctionDefinition;
    /**
     * The payload format version for the route.
     *
     * @default "2.0"
     */
    payloadFormatVersion?: ApiPayloadFormatVersion;
    cdk?: {
        /**
         * Use an existing Lambda function.
         */
        function?: IFunction;
    };
}
/**
 * Specify a function route handler and configure additional options
 *
 * @example
 * ```js
 * api.addRoutes(stack, {
 *   "GET /notes/{id}": {
 *     type: "aws",
 *     cdk: {
 *       integration: {
 *         subtype: apig.HttpIntegrationSubtype.EVENTBRIDGE_PUT_EVENTS,
 *         parameterMapping: ParameterMapping.fromObject({
 *           Source: MappingValue.custom("$request.body.source"),
 *           DetailType: MappingValue.custom("$request.body.detailType"),
 *           Detail: MappingValue.custom("$request.body.detail"),
 *         }),
 *       }
 *     }
 *   }
 * });
 * ```
 */
export interface ApiAwsRouteProps<AuthorizersKeys> extends ApiBaseRouteProps<AuthorizersKeys> {
    /**
     * This is a constant
     */
    type: "aws";
    cdk: {
        integration: Omit<CdkHttpAwsIntegrationProps, "credentials">;
    };
}
/**
 * Specify a route handler that forwards to another URL
 *
 * @example
 * ```js
 * api.addRoutes(stack, {
 *   "GET /notes/{id}": {
 *     type: "url",
 *     url: "https://example.com/notes/{id}",
 *   }
 * });
 * ```
 */
export interface ApiHttpRouteProps<AuthorizersKeys> extends ApiBaseRouteProps<AuthorizersKeys> {
    /**
     * This is a constant
     */
    type: "url";
    /**
     * The URL to forward to
     */
    url: string;
    cdk?: {
        /**
         * Override the underlying CDK integration
         */
        integration: HttpUrlIntegrationProps;
    };
}
/**
 * Specify a route handler that forwards to an ALB
 *
 * @example
 * ```js
 * api.addRoutes(stack, {
 *   "GET /notes/{id}": {
 *     type: "alb",
 *     cdk: {
 *       albListener: listener,
 *     }
 *   }
 * });
 * ```
 */
export interface ApiAlbRouteProps<AuthorizersKeys> extends ApiBaseRouteProps<AuthorizersKeys> {
    type: "alb";
    cdk: {
        /**
         * The listener to the application load balancer used for the integration.
         */
        albListener: IApplicationListener;
        integration?: HttpAlbIntegrationProps;
    };
}
/**
 * Specify a route handler that forwards to an NLB
 *
 * @example
 * ```js
 * api.addRoutes(stack, {
 *   "GET /notes/{id}": {
 *     type: "nlb",
 *     cdk: {
 *       nlbListener: listener,
 *     }
 *   }
 * });
 * ```
 */
export interface ApiNlbRouteProps<AuthorizersKeys> extends ApiBaseRouteProps<AuthorizersKeys> {
    type: "nlb";
    cdk: {
        /**
         * The listener to the application load balancer used for the integration.
         */
        nlbListener: INetworkListener;
        integration?: HttpNlbIntegrationProps;
    };
}
/**
 * Specify a route handler that handles GraphQL queries using Pothos
 *
 * @example
 * ```js
 * api.addRoutes(stack, {
 *   "POST /graphql": {
 *      type: "graphql",
 *      function: {
 *        handler: "functions/graphql/graphql.ts",
 *      },
 *      pothos: {
 *        schema: "backend/functions/graphql/schema.ts",
 *        output: "graphql/schema.graphql",
 *        commands: [
 *          "./genql graphql/graphql.schema graphql/
 *        ]
 *      }
 *   }
 * })
 * ```
 */
export interface ApiGraphQLRouteProps<AuthorizerKeys> extends ApiBaseRouteProps<AuthorizerKeys> {
    type: "graphql";
    /**
     * The function definition used to create the function for this route. Must be a graphql handler
     */
    function: FunctionDefinition;
    pothos?: {
        /**
         * Path to pothos schema
         */
        schema?: string;
        /**
         * File to write graphql schema to
         */
        output?: string;
        /**
         * Commands to run after generating schema. Useful for code generation steps
         */
        commands?: string[];
        /**
         * List of packages that should be considered internal during schema generation
         */
        internalPackages?: string[];
    };
}
/**
 * The Api construct is a higher level CDK construct that makes it easy to create an API.
 *
 * @example
 *
 * ```ts
 * import { Api } from "sst/constructs";
 *
 * new Api(stack, "Api", {
 *   routes: {
 *     "GET    /notes": "src/list.main",
 *     "POST   /notes": "src/create.main",
 *     "GET    /notes/{id}": "src/get.main",
 *     "PUT    /notes/{id}": "src/update.main",
 *     "DELETE /notes/{id}": "src/delete.main",
 *   },
 * });
 * ```
 */
export declare class Api<Authorizers extends Record<string, ApiAuthorizer> = Record<string, ApiAuthorizer>> extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        /**
         * The internally created CDK HttpApi instance.
         */
        httpApi: HttpApi;
        /**
         * If access logs are enabled, this is the internally created CDK LogGroup instance.
         */
        accessLogGroup?: LogGroup;
        /**
         * If custom domain is enabled, this is the internally created CDK DomainName instance.
         */
        domainName?: DomainName;
        /**
         * If custom domain is enabled, this is the internally created CDK Certificate instance.
         */
        certificate?: Certificate;
    };
    private props;
    private _customDomainUrl?;
    private routesData;
    private authorizersData;
    private bindingForAllRoutes;
    private permissionsAttachedForAllRoutes;
    constructor(scope: Construct, id: string, props?: ApiProps<Authorizers>);
    /**
     * The AWS generated URL of the Api.
     */
    get url(): string;
    /**
     * If custom domain is enabled, this is the custom domain URL of the Api.
     *
     * :::note
     * If you are setting the base mapping for the custom domain, you need to include the trailing slash while using the custom domain URL. For example, if the [`domainName`](#domainname) is set to `api.domain.com` and the [`path`](#path) is `v1`, the custom domain URL of the API will be `https://api.domain.com/v1/`.
     * :::
     */
    get customDomainUrl(): string | undefined;
    /**
     * The routes for the Api
     */
    get routes(): string[];
    /**
     * The ARN of the internally created API Gateway HTTP API
     */
    get httpApiArn(): string;
    /**
     * The id of the internally created API Gateway HTTP API
     */
    get httpApiId(): string;
    /**
     * Adds routes to the Api after it has been created.
     *
     * @example
     * ```js
     * api.addRoutes(stack, {
     *   "GET    /notes/{id}": "src/get.main",
     *   "PUT    /notes/{id}": "src/update.main",
     *   "DELETE /notes/{id}": "src/delete.main",
     * });
     * ```
     */
    addRoutes(scope: Construct, routes: Record<string, ApiRouteProps<keyof Authorizers>>): void;
    /**
     * Get the instance of the internally created Function, for a given route key where the `routeKey` is the key used to define a route. For example, `GET /notes`.
     *
     * @example
     * ```js
     * const api = new Api(stack, "Api", {
     *   routes: {
     *     "GET /notes": "src/list.main",
     *   },
     * });
     *
     * const listFunction = api.getFunction("GET /notes");
     * ```
     */
    getFunction(routeKey: string): Fn | undefined;
    /**
     * Binds the given list of resources to all the routes.
     *
     * @example
     *
     * ```js
     * api.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Binds the given list of resources to a specific route.
     *
     * @example
     * ```js
     * const api = new Api(stack, "Api", {
     *   routes: {
     *     "GET /notes": "src/list.main",
     *   },
     * });
     *
     * api.bindToRoute("GET /notes", [STRIPE_KEY, bucket]);
     * ```
     *
     */
    bindToRoute(routeKey: string, constructs: SSTConstruct[]): void;
    /**
     * Attaches the given list of permissions to all the routes. This allows the functions to access other AWS resources.
     *
     * @example
     *
     * ```js
     * api.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Attaches the given list of permissions to a specific route. This allows that function to access other AWS resources.
     *
     * @example
     * ```js
     * const api = new Api(stack, "Api", {
     *   routes: {
     *     "GET    /notes": "src/list.main",
     *   },
     * });
     *
     * api.attachPermissionsToRoute("GET /notes", ["s3"]);
     * ```
     *
     */
    attachPermissionsToRoute(routeKey: string, permissions: Permissions): void;
    getConstructMetadata(): {
        type: "Api";
        data: {
            graphql: boolean;
            url: string | undefined;
            httpApiId: string;
            customDomainUrl: string | undefined;
            routes: ({
                type: "function";
                route: string;
                fn: {
                    node: string;
                    stack: string;
                } | undefined;
                schema?: undefined;
                internalPackages?: undefined;
                output?: undefined;
                commands?: undefined;
            } | {
                type: "graphql";
                route: string;
                fn: {
                    node: string;
                    stack: string;
                } | undefined;
                schema: string | undefined;
                internalPackages: string[] | undefined;
                output: string | undefined;
                commands: string[] | undefined;
            } | {
                type: "lambda_function" | "aws" | "url" | "alb" | "nlb";
                route: string;
                fn?: undefined;
                schema?: undefined;
                internalPackages?: undefined;
                output?: undefined;
                commands?: undefined;
            })[];
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    private createHttpApi;
    private addAuthorizers;
    private addRoute;
    private createAwsProxyIntegration;
    private createHttpIntegration;
    private createAlbIntegration;
    private createNlbIntegration;
    protected createGraphQLIntegration(scope: Construct, routeKey: string, routeProps: ApiGraphQLRouteProps<keyof Authorizers>, postfixName: string): HttpRouteIntegration;
    protected createCdkFunctionIntegration(_scope: Construct, routeKey: string, routeProps: ApiFunctionRouteProps<keyof Authorizers>, postfixName: string): HttpRouteIntegration;
    protected createFunctionIntegration(scope: Construct, routeKey: string, routeProps: ApiFunctionRouteProps<keyof Authorizers>, postfixName: string): HttpRouteIntegration;
    private buildRouteAuth;
    private normalizeRouteKey;
    /**
     * Binds the given list of resources to a specific route.
     *
     * @example
     * ```js
     * const api = new Api(stack, "Api");
     *
     * api.setCors({
     *   allowMethods: ["GET"],
     * });
     * ```
     *
     */
    setCors(cors?: boolean | ApiCorsProps): void;
}
export {};
