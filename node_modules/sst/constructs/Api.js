import { Construct } from "constructs";
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, } from "aws-cdk-lib/aws-iam";
import { HttpUrlIntegration, HttpAlbIntegration, HttpNlbIntegration, HttpLambdaIntegration, } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpAwsIntegration, } from "./cdk/HttpAwsIntegration.js";
import { Stack } from "./Stack.js";
import { getFunctionRef, isCDKConstruct } from "./Construct.js";
import { Function as Fn, } from "./Function.js";
import { toCdkDuration } from "./util/duration.js";
import * as apigV2Cors from "./util/apiGatewayV2Cors.js";
import * as apigV2Domain from "./util/apiGatewayV2Domain.js";
import * as apigV2AccessLog from "./util/apiGatewayV2AccessLog.js";
import { HttpApi, HttpMethod, HttpNoneAuthorizer, HttpRoute, HttpRouteKey, HttpStage, IntegrationCredentials, PayloadFormatVersion, } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpIamAuthorizer, HttpJwtAuthorizer, HttpLambdaAuthorizer, HttpLambdaResponseType, HttpUserPoolAuthorizer, } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
const PayloadFormatVersions = ["1.0", "2.0"];
/////////////////////
// Construct
/////////////////////
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
export class Api extends Construct {
    id;
    cdk;
    props;
    _customDomainUrl;
    routesData;
    authorizersData;
    bindingForAllRoutes = [];
    permissionsAttachedForAllRoutes = [];
    constructor(scope, id, props) {
        super(scope, props?.cdk?.id || id);
        this.id = id;
        this.props = props || {};
        this.cdk = {};
        this.routesData = {};
        this.authorizersData = {};
        this.createHttpApi();
        this.addAuthorizers(this.props.authorizers || {});
        this.addRoutes(this, this.props.routes || {});
        const app = this.node.root;
        app.registerTypes(this);
    }
    /**
     * The AWS generated URL of the Api.
     */
    get url() {
        const app = this.node.root;
        return this.cdk.httpApi instanceof HttpApi
            ? this.cdk.httpApi.apiEndpoint
            : `https://${this.cdk.httpApi.apiId}.execute-api.${app.region}.amazonaws.com`;
    }
    /**
     * If custom domain is enabled, this is the custom domain URL of the Api.
     *
     * :::note
     * If you are setting the base mapping for the custom domain, you need to include the trailing slash while using the custom domain URL. For example, if the [`domainName`](#domainname) is set to `api.domain.com` and the [`path`](#path) is `v1`, the custom domain URL of the API will be `https://api.domain.com/v1/`.
     * :::
     */
    get customDomainUrl() {
        return this._customDomainUrl;
    }
    /**
     * The routes for the Api
     */
    get routes() {
        return Object.keys(this.routesData);
    }
    /**
     * The ARN of the internally created API Gateway HTTP API
     */
    get httpApiArn() {
        const stack = Stack.of(this);
        return `arn:${stack.partition}:apigateway:${stack.region}::/apis/${this.cdk.httpApi.apiId}`;
    }
    /**
     * The id of the internally created API Gateway HTTP API
     */
    get httpApiId() {
        return this.cdk.httpApi.apiId;
    }
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
    addRoutes(scope, routes) {
        Object.keys(routes).forEach((routeKey) => {
            this.addRoute(scope, routeKey, routes[routeKey]);
        });
    }
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
    getFunction(routeKey) {
        const route = this.routesData[this.normalizeRouteKey(routeKey)];
        if (!route)
            return;
        if (route.type === "function" || route.type === "graphql") {
            return route.function;
        }
    }
    /**
     * Binds the given list of resources to all the routes.
     *
     * @example
     *
     * ```js
     * api.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs) {
        for (const route of Object.values(this.routesData)) {
            if (route.type === "function" || route.type === "graphql") {
                route.function.bind(constructs);
            }
        }
        this.bindingForAllRoutes.push(...constructs);
    }
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
    bindToRoute(routeKey, constructs) {
        const fn = this.getFunction(routeKey);
        if (!fn) {
            throw new Error(`Failed to bind resources. Route "${routeKey}" does not exist.`);
        }
        fn.bind(constructs);
    }
    /**
     * Attaches the given list of permissions to all the routes. This allows the functions to access other AWS resources.
     *
     * @example
     *
     * ```js
     * api.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions) {
        for (const route of Object.values(this.routesData)) {
            if (route.type === "function" || route.type === "graphql") {
                route.function.attachPermissions(permissions);
            }
        }
        this.permissionsAttachedForAllRoutes.push(permissions);
    }
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
    attachPermissionsToRoute(routeKey, permissions) {
        const fn = this.getFunction(routeKey);
        if (!fn) {
            throw new Error(`Failed to attach permissions. Route "${routeKey}" does not exist.`);
        }
        fn.attachPermissions(permissions);
    }
    getConstructMetadata() {
        return {
            type: "Api",
            data: {
                graphql: false,
                url: this.cdk.httpApi.url,
                httpApiId: this.cdk.httpApi.apiId,
                customDomainUrl: this._customDomainUrl,
                routes: Object.entries(this.routesData).map(([key, data]) => {
                    if (data.type === "function")
                        return {
                            type: "function",
                            route: key,
                            fn: getFunctionRef(data.function),
                        };
                    if (data.type === "graphql")
                        return {
                            type: "graphql",
                            route: key,
                            fn: getFunctionRef(data.function),
                            schema: data.schema,
                            internalPackages: data.internalPackages,
                            output: data.output,
                            commands: data.commands,
                        };
                    return { type: data.type, route: key };
                }),
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        return {
            clientPackage: "api",
            variables: {
                url: {
                    type: "plain",
                    value: this.customDomainUrl || this.url,
                },
            },
            permissions: {},
        };
    }
    createHttpApi() {
        const { cdk, cors, defaults, accessLog, customDomain } = this.props;
        const id = this.node.id;
        const app = this.node.root;
        if (isCDKConstruct(cdk?.httpApi)) {
            if (cors !== undefined) {
                throw new Error(`Cannot configure the "cors" when "cdk.httpApi" is a construct`);
            }
            if (accessLog !== undefined) {
                throw new Error(`Cannot configure the "accessLog" when "cdk.httpApi" is a construct`);
            }
            if (customDomain !== undefined) {
                throw new Error(`Cannot configure the "customDomain" when "cdk.httpApi" is a construct`);
            }
            if (cdk?.httpStages !== undefined) {
                throw new Error(`Cannot configure the "stages" when "cdk.httpApi" is a construct`);
            }
            this.cdk.httpApi = cdk?.httpApi;
        }
        else {
            const httpApiProps = (cdk?.httpApi || {});
            // Validate input
            if (httpApiProps.corsPreflight !== undefined) {
                throw new Error(`Cannot configure the "httpApi.corsPreflight" in the Api`);
            }
            if (httpApiProps.defaultDomainMapping !== undefined) {
                throw new Error(`Cannot configure the "httpApi.defaultDomainMapping" in the Api`);
            }
            // Handle Custom Domain
            const customDomainData = apigV2Domain.buildCustomDomainData(this, customDomain);
            let defaultDomainMapping;
            if (customDomainData) {
                if (customDomainData.isApigDomainCreated) {
                    this.cdk.domainName = customDomainData.apigDomain;
                }
                if (customDomainData.isCertificatedCreated) {
                    this.cdk.certificate = customDomainData.certificate;
                }
                defaultDomainMapping = {
                    domainName: customDomainData.apigDomain,
                    mappingKey: customDomainData.mappingKey,
                };
                this._customDomainUrl = `https://${customDomainData.url}`;
            }
            this.cdk.httpApi = new HttpApi(this, "Api", {
                apiName: app.logicalPrefixedName(id),
                corsPreflight: apigV2Cors.buildCorsConfig(cors),
                defaultDomainMapping,
                ...httpApiProps,
            });
            const httpStage = this.cdk.httpApi.defaultStage;
            // Configure throttling
            if (defaults?.throttle?.burst && defaults?.throttle?.rate) {
                const cfnStage = httpStage.node.defaultChild;
                cfnStage.defaultRouteSettings = {
                    ...(cfnStage.routeSettings || {}),
                    throttlingBurstLimit: defaults.throttle.burst,
                    throttlingRateLimit: defaults.throttle.rate,
                };
            }
            // Configure access log
            for (const def of cdk?.httpStages || []) {
                const stage = new HttpStage(this, "Stage" + def.stageName, {
                    ...def,
                    httpApi: this.cdk.httpApi,
                });
                apigV2AccessLog.buildAccessLogData(this, accessLog, stage, false);
            }
            if (this.cdk.httpApi.defaultStage)
                this.cdk.accessLogGroup = apigV2AccessLog.buildAccessLogData(this, accessLog, this.cdk.httpApi.defaultStage, true);
        }
    }
    addAuthorizers(authorizers) {
        Object.entries(authorizers).forEach(([key, value]) => {
            if (key === "none") {
                throw new Error(`Cannot name an authorizer "none"`);
            }
            else if (key === "iam") {
                throw new Error(`Cannot name an authorizer "iam"`);
            }
            else if (value.type === "user_pool") {
                if (value.cdk?.authorizer) {
                    this.authorizersData[key] = value.cdk.authorizer;
                }
                else {
                    if (!value.userPool) {
                        throw new Error(`Missing "userPool" for "${key}" authorizer`);
                    }
                    const userPool = UserPool.fromUserPoolId(this, `Api-${this.node.id}-Authorizer-${key}-UserPool`, value.userPool.id);
                    const userPoolClients = value.userPool.clientIds &&
                        value.userPool.clientIds.map((clientId, i) => UserPoolClient.fromUserPoolClientId(this, `Api-${this.node.id}-Authorizer-${key}-UserPoolClient-${i}`, clientId));
                    this.authorizersData[key] = new HttpUserPoolAuthorizer(key, userPool, {
                        authorizerName: value.name,
                        identitySource: value.identitySource,
                        userPoolClients,
                        userPoolRegion: value.userPool.region,
                    });
                }
            }
            else if (value.type === "jwt") {
                if (value.cdk?.authorizer) {
                    this.authorizersData[key] = value.cdk.authorizer;
                }
                else {
                    if (!value.jwt) {
                        throw new Error(`Missing "jwt" for "${key}" authorizer`);
                    }
                    this.authorizersData[key] = new HttpJwtAuthorizer(key, value.jwt.issuer, {
                        authorizerName: value.name,
                        identitySource: value.identitySource,
                        jwtAudience: value.jwt.audience,
                    });
                }
            }
            else if (value.type === "lambda") {
                if (value.cdk?.authorizer) {
                    this.authorizersData[key] = value.cdk.authorizer;
                }
                else {
                    if (!value.function) {
                        throw new Error(`Missing "function" for "${key}" authorizer`);
                    }
                    this.authorizersData[key] = new HttpLambdaAuthorizer(key, value.function, {
                        authorizerName: value.name,
                        identitySource: value.identitySource,
                        responseTypes: value.responseTypes &&
                            value.responseTypes.map((type) => HttpLambdaResponseType[type.toUpperCase()]),
                        resultsCacheTtl: value.resultsCacheTtl
                            ? toCdkDuration(value.resultsCacheTtl)
                            : toCdkDuration("0 seconds"),
                    });
                }
            }
        });
    }
    addRoute(scope, routeKey, routeValue) {
        ///////////////////
        // Normalize routeKey
        ///////////////////
        routeKey = this.normalizeRouteKey(routeKey);
        if (this.routesData[routeKey]) {
            throw new Error(`A route already exists for "${routeKey}"`);
        }
        ///////////////////
        // Get path and method
        ///////////////////
        let postfixName;
        let httpRouteKey;
        let method;
        let path;
        if (routeKey === "$default") {
            postfixName = "default";
            httpRouteKey = HttpRouteKey.DEFAULT;
            method = "ANY";
            path = routeKey;
        }
        else {
            const routeKeyParts = routeKey.split(" ");
            if (routeKeyParts.length !== 2) {
                throw new Error(`Invalid route ${routeKey}`);
            }
            method = routeKeyParts[0].toUpperCase();
            if (!HttpMethod[method]) {
                throw new Error(`Invalid method defined for "${routeKey}"`);
            }
            path = routeKeyParts[1];
            if (path.length === 0) {
                throw new Error(`Invalid path defined for "${routeKey}"`);
            }
            postfixName = `${method}_${path}`;
            httpRouteKey = HttpRouteKey.with(path, HttpMethod[method]);
        }
        ///////////////////
        // Create route
        ///////////////////
        const [routeProps, integration] = (() => {
            if (Fn.isInlineDefinition(routeValue)) {
                const routeProps = {
                    function: routeValue,
                };
                return [
                    routeProps,
                    this.createFunctionIntegration(scope, routeKey, routeProps, postfixName),
                ];
            }
            if (routeValue.type === "aws") {
                return [
                    routeValue,
                    this.createAwsProxyIntegration(scope, routeKey, routeValue, postfixName),
                ];
            }
            if (routeValue.type === "alb") {
                return [
                    routeValue,
                    this.createAlbIntegration(scope, routeKey, routeValue, postfixName),
                ];
            }
            if (routeValue.type === "nlb") {
                return [
                    routeValue,
                    this.createNlbIntegration(scope, routeKey, routeValue, postfixName),
                ];
            }
            if (routeValue.type === "url") {
                return [
                    routeValue,
                    this.createHttpIntegration(scope, routeKey, routeValue, postfixName),
                ];
            }
            if (routeValue.type === "graphql") {
                return [
                    routeValue,
                    this.createGraphQLIntegration(scope, routeKey, routeValue, postfixName),
                ];
            }
            if (routeValue.cdk?.function) {
                return [
                    routeValue,
                    this.createCdkFunctionIntegration(scope, routeKey, routeValue, postfixName),
                ];
            }
            if ("function" in routeValue) {
                return [
                    routeValue,
                    this.createFunctionIntegration(scope, routeKey, routeValue, postfixName),
                ];
            }
            if ("handler" in routeValue)
                throw new Error(`Function definition must be nested under the "function" key in the route props for "${routeKey}". ie. { function: { handler: "myfunc.handler" } }`);
            throw new Error(`Invalid route type "${routeValue.type}" for "${routeKey}".`);
        })();
        const { authorizationType, authorizer, authorizationScopes } = this.buildRouteAuth(routeProps);
        const route = new HttpRoute(scope, `Route_${postfixName}`, {
            httpApi: this.cdk.httpApi,
            routeKey: httpRouteKey,
            integration,
            authorizer,
            authorizationScopes,
        });
        ////////////////////
        // Configure route authorization type
        ////////////////////
        // Note: we need to explicitly set `cfnRoute.authorizationType` to `NONE`
        //       because if it were set to `AWS_IAM`, and then it is removed from
        //       the CloudFormation template (ie. set to undefined), CloudFormation
        //       doesn't updates the route. The route's authorizationType would still
        //       be `AWS_IAM`.
        const cfnRoute = route.node.defaultChild;
        if (authorizationType === "iam") {
            cfnRoute.authorizationType = "AWS_IAM";
        }
        else if (authorizationType === "none") {
            cfnRoute.authorizationType = "NONE";
        }
    }
    createAwsProxyIntegration(scope, routeKey, routeProps, postfixName) {
        // Create IAM role for API Gateway to call the AWS services
        const [service, serviceApi] = routeProps.cdk.integration.subtype.split("-");
        const servicePrefix = {
            EventBridge: "events",
            SQS: "sqs",
            AppConfig: "appconfig",
            Kinesis: "kinesis",
            StepFunctions: "states",
        }[service];
        const role = new Role(scope, `IntegrationRole_${postfixName}`, {
            assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
            inlinePolicies: {
                Policy: new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: [`${servicePrefix}:${serviceApi}`],
                            resources: ["*"],
                        }),
                    ],
                }),
            },
        });
        // Create integration
        const integration = new HttpAwsIntegration(`Integration_${postfixName}`, {
            ...routeProps.cdk.integration,
            credentials: IntegrationCredentials.fromRole(role),
        });
        // Store route
        this.routesData[routeKey] = {
            type: "aws",
        };
        return integration;
    }
    createHttpIntegration(_scope, routeKey, routeProps, postfixName) {
        ///////////////////
        // Create integration
        ///////////////////
        const integration = new HttpUrlIntegration(`Integration_${postfixName}`, routeProps.url, routeProps.cdk?.integration);
        // Store route
        this.routesData[routeKey] = {
            type: "url",
            url: routeProps.url,
        };
        return integration;
    }
    createAlbIntegration(_scope, routeKey, routeProps, postfixName) {
        ///////////////////
        // Create integration
        ///////////////////
        const integration = new HttpAlbIntegration(`Integration_${postfixName}`, routeProps.cdk?.albListener, routeProps.cdk?.integration);
        // Store route
        this.routesData[routeKey] = {
            type: "alb",
            alb: routeProps.cdk?.albListener,
        };
        return integration;
    }
    createNlbIntegration(_scope, routeKey, routeProps, postfixName) {
        ///////////////////
        // Create integration
        ///////////////////
        const integration = new HttpNlbIntegration(`Integration_${postfixName}`, routeProps.cdk?.nlbListener, routeProps.cdk?.integration);
        // Store route
        this.routesData[routeKey] = {
            type: "nlb",
            nlb: routeProps.cdk?.nlbListener,
        };
        return integration;
    }
    createGraphQLIntegration(scope, routeKey, routeProps, postfixName) {
        const result = this.createFunctionIntegration(scope, routeKey, {
            ...routeProps,
            type: "function",
            payloadFormatVersion: "2.0",
        }, postfixName);
        const data = this.routesData[routeKey];
        if (data.type === "function") {
            data.function.addEnvironment("GRAPHQL_ENDPOINT", routeKey.split(" ")[1]);
            this.routesData[routeKey] = {
                ...data,
                type: "graphql",
                output: routeProps.pothos?.output,
                schema: routeProps.pothos?.schema,
                commands: routeProps.pothos?.commands,
                internalPackages: routeProps.pothos?.internalPackages,
            };
        }
        return result;
    }
    createCdkFunctionIntegration(_scope, routeKey, routeProps, postfixName) {
        ///////////////////
        // Get payload format
        ///////////////////
        const payloadFormatVersion = routeProps.payloadFormatVersion ||
            this.props.defaults?.payloadFormatVersion ||
            "2.0";
        if (!PayloadFormatVersions.includes(payloadFormatVersion)) {
            throw new Error(`PayloadFormatVersion: sst.Api does not currently support ${payloadFormatVersion} payload format version. Only "V1" and "V2" are currently supported.`);
        }
        const integrationPayloadFormatVersion = payloadFormatVersion === "1.0"
            ? PayloadFormatVersion.VERSION_1_0
            : PayloadFormatVersion.VERSION_2_0;
        ///////////////////
        // Create Function
        ///////////////////
        const lambda = routeProps.cdk?.function;
        ///////////////////
        // Create integration
        ///////////////////
        const integration = new HttpLambdaIntegration(`Integration_${postfixName}`, lambda, {
            payloadFormatVersion: integrationPayloadFormatVersion,
        });
        // Store route
        this.routesData[routeKey] = {
            type: "lambda_function",
            function: lambda,
        };
        return integration;
    }
    createFunctionIntegration(scope, routeKey, routeProps, postfixName) {
        ///////////////////
        // Get payload format
        ///////////////////
        const payloadFormatVersion = routeProps.payloadFormatVersion ||
            this.props.defaults?.payloadFormatVersion ||
            "2.0";
        if (!PayloadFormatVersions.includes(payloadFormatVersion)) {
            throw new Error(`PayloadFormatVersion: sst.Api does not currently support ${payloadFormatVersion} payload format version. Only "V1" and "V2" are currently supported.`);
        }
        const integrationPayloadFormatVersion = payloadFormatVersion === "1.0"
            ? PayloadFormatVersion.VERSION_1_0
            : PayloadFormatVersion.VERSION_2_0;
        ///////////////////
        // Create Function
        ///////////////////
        const lambda = Fn.fromDefinition(scope, `Lambda_${postfixName}`, routeProps.function, this.props.defaults?.function, `The "defaults.function" cannot be applied if an instance of a Function construct is passed in. Make sure to define all the routes using FunctionProps, so the Api construct can apply the "defaults.function" to them.`);
        // Add an environment variable to determine if the function is an Api route.
        // If it is, when "sst start" is not connected, we want to return an 500
        // status code and a descriptive error message.
        const root = scope.node.root;
        if (root.local) {
            lambda.addEnvironment("SST_DEBUG_IS_API_ROUTE", "1", {
                removeInEdge: true,
            });
        }
        ///////////////////
        // Create integration
        ///////////////////
        const integration = new HttpLambdaIntegration(`Integration_${postfixName}`, lambda, {
            payloadFormatVersion: integrationPayloadFormatVersion,
        });
        // Store route
        this.routesData[routeKey] = {
            type: "function",
            function: lambda,
        };
        // Attached existing permissions
        this.permissionsAttachedForAllRoutes.forEach((permissions) => lambda.attachPermissions(permissions));
        lambda.bind(this.bindingForAllRoutes);
        return integration;
    }
    buildRouteAuth(routeProps) {
        const authorizerKey = routeProps?.authorizer || this.props.defaults?.authorizer || "none";
        if (authorizerKey === "none") {
            return {
                authorizationType: "none",
                authorizer: new HttpNoneAuthorizer(),
            };
        }
        else if (authorizerKey === "iam") {
            return {
                authorizationType: "iam",
                authorizer: new HttpIamAuthorizer(),
            };
        }
        if (!this.props.authorizers ||
            !this.props.authorizers[authorizerKey]) {
            throw new Error(`Cannot find authorizer "${authorizerKey.toString()}"`);
        }
        const authorizer = this.authorizersData[authorizerKey];
        const authorizationType = this.props.authorizers[authorizerKey].type;
        const authorizationScopes = authorizationType === "jwt" || authorizationType === "user_pool"
            ? routeProps?.authorizationScopes ||
                this.props.defaults?.authorizationScopes
            : undefined;
        return { authorizationType, authorizer, authorizationScopes };
    }
    normalizeRouteKey(routeKey) {
        return routeKey.split(/\s+/).join(" ");
    }
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
    setCors(cors) {
        const { cdk } = this.props;
        if (isCDKConstruct(cdk?.httpApi)) {
            // Cannot set CORS if cdk.httpApi is a construct.
            if (cors !== undefined) {
                throw new Error(`Cannot configure the "cors" when "cdk.httpApi" is a construct`);
            }
        }
        else {
            // Cannot set CORS via cdk.httpApi. Always use Api.cors.
            const httpApiProps = (cdk?.httpApi || {});
            if (httpApiProps.corsPreflight !== undefined) {
                throw new Error(`Cannot configure the "httpApi.corsPreflight" in the Api`);
            }
            const corsConfig = apigV2Cors.buildCorsConfig(cors);
            if (corsConfig) {
                const cfnApi = this.cdk.httpApi.node.defaultChild;
                cfnApi.corsConfiguration = {
                    allowCredentials: corsConfig?.allowCredentials,
                    allowHeaders: corsConfig?.allowHeaders,
                    allowMethods: corsConfig?.allowMethods,
                    allowOrigins: corsConfig?.allowOrigins,
                    exposeHeaders: corsConfig?.exposeHeaders,
                    maxAge: corsConfig?.maxAge?.toSeconds(),
                };
            }
        }
    }
}
