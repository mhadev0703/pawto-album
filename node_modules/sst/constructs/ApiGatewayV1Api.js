import { Construct } from "constructs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as apigV1AccessLog from "./util/apiGatewayV1AccessLog.js";
import { Stack } from "./Stack.js";
import { toCdkDuration } from "./util/duration.js";
import { getFunctionRef, isCDKConstruct } from "./Construct.js";
import { DnsValidatedCertificate } from "./cdk/dns-validated-certificate.js";
import { Function as Fn, } from "./Function.js";
import { Duration as CDKDuration, Token } from "aws-cdk-lib/core";
const allowedMethods = [
    "ANY",
    "GET",
    "PUT",
    "POST",
    "HEAD",
    "PATCH",
    "DELETE",
    "OPTIONS",
];
/////////////////////
// Construct
/////////////////////
/**
 *
 * The `ApiGatewayV1Api` construct is a higher level CDK construct that makes it easy to create an API Gateway REST API.
 *
 * @example
 *
 * ```js
 * import { ApiGatewayV1Api } from "sst/constructs";
 *
 * new ApiGatewayV1Api(stack, "Api", {
 *   routes: {
 *     "GET    /notes"     : "src/list.main",
 *     "POST   /notes"     : "src/create.main",
 *     "GET    /notes/{id}": "src/get.main",
 *     "PUT    /notes/{id}": "src/update.main",
 *     "DELETE /notes/{id}": "src/delete.main",
 *   },
 * });
 * ```
 */
export class ApiGatewayV1Api extends Construct {
    id;
    cdk;
    _deployment;
    _customDomainUrl;
    importedResources = {};
    props;
    functions = {};
    authorizersData = {};
    bindingForAllRoutes = [];
    permissionsAttachedForAllRoutes = [];
    constructor(scope, id, props) {
        super(scope, props?.cdk?.id || id);
        this.id = id;
        this.props = props || {};
        this.cdk = {};
        this.createRestApi();
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
        return (this.cdk.restApi.url ??
            `https://${this.cdk.restApi.restApiId}.execute-api.${app.region}.amazonaws.com/${app.stage}/`);
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
        return Object.keys(this.functions);
    }
    /**
     * The ARN of the internally created API Gateway REST API
     */
    get restApiArn() {
        const stack = Stack.of(this);
        return `arn:${stack.partition}:apigateway:${stack.region}::/restapis/${this.cdk.restApi.restApiId}`;
    }
    /**
     * The id of the internally created API Gateway REST API
     */
    get restApiId() {
        return this.cdk.restApi.restApiId;
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
        Object.keys(routes).forEach((routeKey) => this.addRoute(scope, routeKey, routes[routeKey]));
    }
    /**
     * Get the instance of the internally created Function, for a given route key where the `routeKey` is the key used to define a route. For example, `GET /notes`.
     *
     * @example
     * ```js
     * const api = new ApiGatewayV1Api(stack, "Api", {
     *   routes: {
     *     "GET    /notes": "src/list.main",
     *   },
     * });
     *
     * const listFunction = api.getFunction("GET /notes");
     * ```
     */
    getFunction(routeKey) {
        const fn = this.functions[this.normalizeRouteKey(routeKey)];
        if (fn instanceof Fn) {
            return fn;
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
        Object.values(this.functions).forEach((fn) => {
            if (fn instanceof Fn) {
                fn.bind(constructs);
            }
        });
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
        Object.values(this.functions).forEach((fn) => {
            if (fn instanceof Fn) {
                fn.attachPermissions(permissions);
            }
        });
        this.permissionsAttachedForAllRoutes.push(permissions);
    }
    /**
     * Attaches the given list of permissions to a specific route. This allows that function to access other AWS resources.
     *
     * @example
     * ```js
     * const api = new ApiGatewayV1Api(stack, "Api", {
     *   routes: {
     *     "GET /notes": "src/list.main",
     *   },
     * });
     *
     * api.attachPermissionsToRoute("GET /notes", ["s3"]);
     * ```
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
            type: "ApiGatewayV1Api",
            data: {
                customDomainUrl: this._customDomainUrl,
                url: this.cdk.restApi.url,
                restApiId: this.cdk.restApi.restApiId,
                routes: Object.entries(this.functions).map(([key, data]) => {
                    return {
                        type: "function",
                        route: key,
                        fn: getFunctionRef(data),
                    };
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
    createRestApi() {
        const { cdk, cors, accessLog, customDomain } = this.props;
        const id = this.node.id;
        const app = this.node.root;
        if (isCDKConstruct(cdk?.restApi)) {
            if (cors !== undefined) {
                throw new Error(`Cannot configure the "cors" when the "restApi" is imported`);
            }
            if (accessLog !== undefined) {
                throw new Error(`Cannot configure the "accessLog" when the "restApi" is imported`);
            }
            if (customDomain !== undefined) {
                throw new Error(`Cannot configure the "customDomain" when the "restApi" is imported`);
            }
            this.cdk.restApi = cdk?.restApi;
            // Create an API Gateway deployment resource to trigger a deployment
            this._deployment = new apig.Deployment(this, "Deployment", {
                api: this.cdk.restApi,
            });
            const cfnDeployment = this._deployment.node
                .defaultChild;
            cfnDeployment.stageName = app.stage;
            if (cdk?.importedPaths) {
                this.importResources(cdk?.importedPaths);
            }
        }
        else {
            const restApiProps = (cdk?.restApi || {});
            // Validate input
            if (cdk?.importedPaths !== undefined) {
                throw new Error(`Cannot import route paths when creating a new API.`);
            }
            if (customDomain !== undefined && restApiProps.domainName !== undefined) {
                throw new Error(`Use either the "customDomain" or the "restApi.domainName" to configure the Api domain. Do not use both.`);
            }
            if (cors !== undefined &&
                restApiProps.defaultCorsPreflightOptions !== undefined) {
                throw new Error(`Use either the "cors" or the "restApi.defaultCorsPreflightOptions" to configure the Api's CORS config. Do not use both.`);
            }
            if (accessLog !== undefined &&
                restApiProps.deployOptions?.accessLogDestination !== undefined) {
                throw new Error(`Use either the "accessLog" or the "restApi.deployOptions.accessLogDestination" to configure the Api's access log. Do not use both.`);
            }
            if (accessLog !== undefined &&
                restApiProps.deployOptions?.accessLogFormat !== undefined) {
                throw new Error(`Use either the "accessLog" or the "restApi.deployOptions.accessLogFormat" to configure the Api's access log. Do not use both.`);
            }
            const stageName = restApiProps.deployOptions?.stageName || this.node.root.stage;
            const accessLogData = apigV1AccessLog.buildAccessLogData(this, accessLog);
            this.cdk.accessLogGroup = accessLogData?.logGroup;
            this.cdk.restApi = new apig.RestApi(this, "Api", {
                restApiName: app.logicalPrefixedName(id),
                ...restApiProps,
                domainName: restApiProps.domainName,
                defaultCorsPreflightOptions: restApiProps.defaultCorsPreflightOptions ||
                    this.buildCorsConfig(cors),
                deployOptions: {
                    ...(restApiProps.deployOptions || {}),
                    accessLogDestination: restApiProps.deployOptions?.accessLogDestination ||
                        accessLogData?.destination,
                    accessLogFormat: restApiProps.deployOptions?.accessLogFormat ||
                        accessLogData?.format,
                    // default to the name of the sage
                    stageName: stageName,
                    // default to true
                    tracingEnabled: restApiProps.deployOptions?.tracingEnabled === undefined
                        ? true
                        : restApiProps.deployOptions?.tracingEnabled,
                },
            });
            this.createCustomDomain(customDomain);
            this.createGatewayResponseForCors(cors);
        }
    }
    buildCorsConfig(cors) {
        // Case: cors is false
        if (cors === false) {
            return undefined;
        }
        // Case: cors is true or undefined
        return {
            allowHeaders: ["*"],
            allowOrigins: apig.Cors.ALL_ORIGINS,
            allowMethods: apig.Cors.ALL_METHODS,
        };
    }
    createGatewayResponseForCors(cors) {
        if (!cors) {
            return;
        }
        this.cdk.restApi.addGatewayResponse("GatewayResponseDefault4XX", {
            type: apig.ResponseType.DEFAULT_4XX,
            responseHeaders: {
                "Access-Control-Allow-Origin": "'*'",
                "Access-Control-Allow-Headers": "'*'",
            },
        });
        this.cdk.restApi.addGatewayResponse("GatewayResponseDefault5XX", {
            type: apig.ResponseType.DEFAULT_5XX,
            responseHeaders: {
                "Access-Control-Allow-Origin": "'*'",
                "Access-Control-Allow-Headers": "'*'",
            },
        });
    }
    createCustomDomain(customDomain) {
        // Case: customDomain is not set
        if (customDomain === undefined) {
            return;
        }
        // To be implemented: to allow more flexible use cases, SST should support 3 more use cases:
        //  1. Allow user passing in `hostedZone` object. The use case is when there are multiple
        //     HostedZones with the same domain, but one is public, and one is private.
        //  2. Allow user passing in `certificate` object. The use case is for user to create wildcard
        //     certificate or using an imported certificate.
        //  3. Allow user passing in `apigDomainName` object. The use case is a user creates multiple API
        //     endpoints, and is mapping them under the same custom domain. `sst.Api` needs to expose the
        //     `apigDomainName` construct created in the first Api, and lets user pass it in when creating
        //     the second Api.
        let domainName, hostedZone, hostedZoneDomain, certificate, apigDomainName, basePath, endpointType, mtls, securityPolicy;
        /////////////////////
        // Parse input
        /////////////////////
        // Case: customDomain is a string
        if (typeof customDomain === "string") {
            // validate: customDomain is a TOKEN string
            // ie. imported SSM value: ssm.StringParameter.valueForStringParameter()
            if (Token.isUnresolved(customDomain)) {
                throw new Error(`You also need to specify the "hostedZone" if the "domainName" is passed in as a reference.`);
            }
            domainName = customDomain;
            this.assertDomainNameIsLowerCase(domainName);
            hostedZoneDomain = customDomain.split(".").slice(1).join(".");
        }
        // Case: customDomain.domainName is a string
        else if (customDomain.domainName) {
            domainName = customDomain.domainName;
            // parse customDomain.domainName
            if (Token.isUnresolved(customDomain.domainName)) {
                // If customDomain is a TOKEN string, "hostedZone" has to be passed in. This
                // is because "hostedZone" cannot be parsed from a TOKEN value.
                if (!customDomain.hostedZone && !customDomain.cdk?.hostedZone) {
                    throw new Error(`You also need to specify the "hostedZone" if the "domainName" is passed in as a reference.`);
                }
                domainName = customDomain.domainName;
            }
            else {
                domainName = customDomain.domainName;
                this.assertDomainNameIsLowerCase(domainName);
            }
            // parse customDomain.hostedZone
            if (customDomain.hostedZone && customDomain.cdk?.hostedZone) {
                throw new Error(`Use either the "customDomain.hostedZone" or the "customDomain.cdk.hostedZone" to configure the custom domain hosted zone. Do not use both.`);
            }
            if (customDomain.hostedZone) {
                hostedZoneDomain = customDomain.hostedZone;
            }
            else if (customDomain.cdk?.hostedZone) {
                hostedZone = customDomain.cdk?.hostedZone;
            }
            else {
                hostedZoneDomain = domainName.split(".").slice(1).join(".");
            }
            certificate = customDomain.cdk?.certificate;
            basePath = customDomain.path;
            endpointType = customDomain.endpointType;
            mtls = customDomain.mtls;
            securityPolicy = customDomain.securityPolicy;
        }
        // Case: customDomain.domainName is a construct
        else if (customDomain.cdk?.domainName) {
            apigDomainName = customDomain.cdk.domainName;
            // customDomain.domainName is imported
            if (apigDomainName &&
                (customDomain.hostedZone || customDomain.cdk?.hostedZone)) {
                throw new Error(`Cannot configure the "hostedZone" when the "domainName" is a construct`);
            }
            if (apigDomainName && customDomain.cdk?.certificate) {
                throw new Error(`Cannot configure the "certificate" when the "domainName" is a construct`);
            }
            if (apigDomainName && customDomain.endpointType) {
                throw new Error(`Cannot configure the "endpointType" when the "domainName" is a construct`);
            }
            if (apigDomainName && customDomain.mtls) {
                throw new Error(`Cannot configure the "mtls" when the "domainName" is a construct`);
            }
            if (apigDomainName && customDomain.securityPolicy) {
                throw new Error(`Cannot configure the "securityPolicy" when the "domainName" is a construct`);
            }
            basePath = customDomain.path;
        }
        /////////////////////
        // Find hosted zone
        /////////////////////
        if (!apigDomainName && !hostedZone) {
            // Look up hosted zone
            if (!hostedZone && hostedZoneDomain) {
                hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
                    domainName: hostedZoneDomain,
                });
            }
        }
        /////////////////////
        // Create certificate
        /////////////////////
        if (!apigDomainName && !certificate) {
            if (endpointType === "edge") {
                certificate = new DnsValidatedCertificate(this, "CrossRegionCertificate", {
                    domainName: domainName,
                    hostedZone: hostedZone,
                    region: "us-east-1",
                });
            }
            else {
                certificate = new acm.Certificate(this, "Certificate", {
                    domainName: domainName,
                    validation: acm.CertificateValidation.fromDns(hostedZone),
                });
            }
            this.cdk.certificate = certificate;
        }
        /////////////////////
        // Create API Gateway domain name
        /////////////////////
        if (!apigDomainName && domainName) {
            // Create custom domain in API Gateway
            apigDomainName = new apig.DomainName(this, "DomainName", {
                domainName,
                certificate: certificate,
                endpointType: endpointType &&
                    apig.EndpointType[endpointType.toLocaleUpperCase()],
                mtls: mtls && {
                    ...mtls,
                    bucket: mtls.bucket.cdk.bucket,
                },
                securityPolicy: securityPolicy === "TLS 1.0"
                    ? apig.SecurityPolicy.TLS_1_0
                    : securityPolicy === "TLS 1.2"
                        ? apig.SecurityPolicy.TLS_1_2
                        : undefined,
            });
            this.cdk.domainName = apigDomainName;
            // Create DNS record
            this.createARecords(hostedZone, domainName, apigDomainName);
        }
        /////////////////////
        // Create base mapping
        /////////////////////
        if (apigDomainName) {
            new apig.BasePathMapping(this, "BasePath", {
                domainName: apigDomainName,
                restApi: this.cdk.restApi,
                basePath,
            });
        }
        // Note: We only know the full custom domain if domainName is a string.
        //       _customDomainUrl will be undefined if apigDomainName is imported.
        if (domainName && !Token.isUnresolved(domainName)) {
            this._customDomainUrl = basePath
                ? `https://${domainName}/${basePath}/`
                : `https://${domainName}`;
        }
    }
    createARecords(hostedZone, domainName, apigDomain) {
        // create DNS record
        const recordProps = {
            recordName: domainName,
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new route53Targets.ApiGatewayDomain(apigDomain)),
        };
        const records = [
            new route53.ARecord(this, "AliasRecord", recordProps),
            new route53.AaaaRecord(this, "AliasRecordAAAA", recordProps),
        ];
        // note: If domainName is a TOKEN string ie. ${TOKEN..}, the route53.ARecord
        //       construct will append ".${hostedZoneName}" to the end of the domain.
        //       This is because the construct tries to check if the record name
        //       ends with the domain name. If not, it will append the domain name.
        //       So, we need remove this behavior.
        if (Token.isUnresolved(domainName)) {
            records.forEach((record) => {
                const cfnRecord = record.node.defaultChild;
                cfnRecord.name = domainName;
            });
        }
    }
    importResources(resources) {
        Object.keys(resources).forEach((path) => {
            const resource = apig.Resource.fromResourceAttributes(this, `Resource_${path}`, {
                path,
                resourceId: resources[path],
                restApi: this.cdk.restApi,
            });
            this.importedResources[path] = resource;
        });
    }
    getResourceForPath(path) {
        // Lookup exact match imported resource
        if (this.importedResources[path]) {
            return this.importedResources[path];
        }
        // Lookup parents matching imported resource first
        const parts = path.split("/");
        for (let i = parts.length; i >= 1; i--) {
            const partialPath = parts.slice(0, i).join("/");
            if (this.importedResources[partialPath]) {
                return this.importedResources[partialPath].resourceForPath(parts.slice(i).join("/"));
            }
        }
        // Not child of imported resources, create off the root
        return this.cdk.restApi.root.resourceForPath(path);
    }
    addAuthorizers(authorizers) {
        Object.entries(authorizers).forEach(([key, value]) => {
            if (key === "none") {
                throw new Error(`Cannot name an authorizer "none"`);
            }
            else if (key === "iam") {
                throw new Error(`Cannot name an authorizer "iam"`);
            }
            else if (value.type === "user_pools") {
                if (value.cdk?.authorizer) {
                    this.authorizersData[key] = value.cdk.authorizer;
                }
                else {
                    if (!value.userPoolIds) {
                        throw new Error(`Missing "userPoolIds" for "${key}" authorizer`);
                    }
                    const userPools = value.userPoolIds.map((userPoolId) => cognito.UserPool.fromUserPoolId(this, `${key}-${userPoolId}-ImportedUserPool`, userPoolId));
                    this.authorizersData[key] = new apig.CognitoUserPoolsAuthorizer(this, key, {
                        cognitoUserPools: userPools,
                        authorizerName: value.name,
                        identitySource: value.identitySource,
                        resultsCacheTtl: value.resultsCacheTtl
                            ? toCdkDuration(value.resultsCacheTtl)
                            : CDKDuration.seconds(0),
                    });
                }
            }
            else if (value.type === "lambda_token") {
                if (value.cdk?.authorizer) {
                    this.authorizersData[key] = value.cdk.authorizer;
                }
                else {
                    if (!value.function) {
                        throw new Error(`Missing "function" for "${key}" authorizer`);
                    }
                    this.authorizersData[key] = new apig.TokenAuthorizer(this, key, {
                        handler: value.function,
                        authorizerName: value.name,
                        identitySource: value.identitySource,
                        validationRegex: value.validationRegex,
                        assumeRole: value.cdk?.assumeRole,
                        resultsCacheTtl: value.resultsCacheTtl
                            ? toCdkDuration(value.resultsCacheTtl)
                            : CDKDuration.seconds(0),
                    });
                }
            }
            else if (value.type === "lambda_request") {
                if (value.cdk?.authorizer) {
                    this.authorizersData[key] = value.cdk.authorizer;
                }
                else {
                    if (!value.function) {
                        throw new Error(`Missing "function" for "${key}" authorizer`);
                    }
                    else if (!value.identitySources) {
                        throw new Error(`Missing "identitySources" for "${key}" authorizer`);
                    }
                    this.authorizersData[key] = new apig.RequestAuthorizer(this, key, {
                        handler: value.function,
                        authorizerName: value.name,
                        identitySources: value.identitySources,
                        assumeRole: value.cdk?.assumeRole,
                        resultsCacheTtl: value.resultsCacheTtl
                            ? toCdkDuration(value.resultsCacheTtl)
                            : CDKDuration.seconds(0),
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
        if (this.functions[routeKey]) {
            throw new Error(`A route already exists for "${routeKey}"`);
        }
        ///////////////////
        // Get path and method
        ///////////////////
        const routeKeyParts = routeKey.split(" ");
        if (routeKeyParts.length !== 2) {
            throw new Error(`Invalid route ${routeKey}`);
        }
        const methodStr = routeKeyParts[0].toUpperCase();
        const path = routeKeyParts[1];
        const method = allowedMethods.find((per) => per === methodStr);
        if (!method) {
            throw new Error(`Invalid method defined for "${routeKey}"`);
        }
        if (path.length === 0) {
            throw new Error(`Invalid path defined for "${routeKey}"`);
        }
        const postfixName = `${methodStr}_${path}`;
        ///////////////////
        // Create Resources
        ///////////////////
        let resource;
        if (path.endsWith("/{proxy+}")) {
            const parentResource = this.getResourceForPath(path.split("/").slice(0, -1).join("/"));
            resource = parentResource.addProxy({ anyMethod: false });
        }
        else {
            resource = this.getResourceForPath(path);
        }
        ///////////////////
        // Create Method
        ///////////////////
        const [routeProps, lambda] = (() => {
            if (Fn.isInlineDefinition(routeValue)) {
                const routeProps = {
                    function: routeValue,
                };
                return [
                    routeProps,
                    this.createFunction(scope, routeKey, routeProps, postfixName),
                ];
            }
            else if (routeValue.cdk?.function) {
                return [
                    routeValue,
                    this.createCdkFunction(scope, routeKey, routeValue, postfixName),
                ];
            }
            else {
                return [
                    routeValue,
                    this.createFunction(scope, routeKey, routeValue, postfixName),
                ];
            }
        })();
        const integration = new apig.LambdaIntegration(lambda, routeProps.cdk?.integration);
        const methodOptions = this.buildRouteMethodOptions(routeProps);
        const apigMethod = resource.addMethod(method, integration, methodOptions);
        ///////////////////
        // Handle manually created Deployment resource (ie. imported REST API)
        ///////////////////
        if (this._deployment) {
            this._deployment.addToLogicalId({ route: { routeKey, routeValue } });
            this._deployment.node.addDependency(apigMethod);
        }
    }
    createCdkFunction(_scope, routeKey, routeProps, _postfixName) {
        const lambda = routeProps.cdk?.function;
        this.functions[routeKey] = lambda;
        return lambda;
    }
    createFunction(scope, routeKey, routeProps, postfixName) {
        const lambda = Fn.fromDefinition(scope, `Lambda_${postfixName}`, routeProps.function, this.props.defaults?.function, `The "defaults.function" cannot be applied if an instance of a Function construct is passed in. Make sure to define all the routes using FunctionProps, so the ApiGatewayV1Api construct can apply the "defaults.function" to them.`);
        // Add an environment variable to determine if the function is an Api route.
        // If it is, when "sst start" is not connected, we want to return an 500
        // status code and a descriptive error message.
        const root = scope.node.root;
        if (root.local) {
            lambda.addEnvironment("SST_DEBUG_IS_API_ROUTE", "1", {
                removeInEdge: true,
            });
        }
        this.functions[routeKey] = lambda;
        // attached existing permissions
        this.permissionsAttachedForAllRoutes.forEach((permissions) => lambda.attachPermissions(permissions));
        lambda.bind(this.bindingForAllRoutes);
        return lambda;
    }
    buildRouteMethodOptions(routeProps) {
        const authorizerKey = routeProps.authorizer || this.props.defaults?.authorizer || "none";
        if (authorizerKey === "none") {
            return {
                authorizationType: apig.AuthorizationType.NONE,
                ...routeProps.cdk?.method,
            };
        }
        else if (authorizerKey === "iam") {
            return {
                authorizationType: apig.AuthorizationType.IAM,
                ...routeProps.cdk?.method,
            };
        }
        if (!this.props.authorizers ||
            !this.props.authorizers[authorizerKey]) {
            throw new Error(`Cannot find authorizer "${authorizerKey.toString()}"`);
        }
        const authorizer = this.authorizersData[authorizerKey];
        const authorizationType = this.props.authorizers[authorizerKey].type;
        if (authorizationType === "user_pools") {
            return {
                authorizationType: apig.AuthorizationType.COGNITO,
                authorizer,
                authorizationScopes: routeProps.authorizationScopes ||
                    this.props.defaults?.authorizationScopes,
                ...routeProps.cdk?.method,
            };
        }
        return {
            authorizationType: apig.AuthorizationType.CUSTOM,
            authorizer,
            ...routeProps.cdk?.method,
        };
    }
    normalizeRouteKey(routeKey) {
        return routeKey.split(/\s+/).join(" ");
    }
    assertDomainNameIsLowerCase(domainName) {
        if (domainName !== domainName.toLowerCase()) {
            throw new Error(`The domain name needs to be in lowercase`);
        }
    }
}
