import path from "path";
import fs from "fs";
export async function weakImport(pkg) {
    try {
        return await import(pkg);
    }
    catch {
        return {};
    }
}
const { print } = await weakImport("graphql");
const { mergeTypeDefs } = await weakImport("@graphql-tools/merge");
import { Construct } from "constructs";
import { Stack } from "./Stack.js";
import * as appSyncApiDomain from "./util/appSyncApiDomain.js";
import { getFunctionRef, isCDKConstruct } from "./Construct.js";
import { Function as Fn, } from "./Function.js";
import { useProject } from "../project.js";
import { GraphqlApi, MappingTemplate as CDKMappingTemplate, Resolver, SchemaFile, Definition, LambdaDataSource, DynamoDbDataSource, RdsDataSource, OpenSearchDataSource, HttpDataSource, NoneDataSource, } from "aws-cdk-lib/aws-appsync";
/////////////////////
// Construct
/////////////////////
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
export class AppSyncApi extends Construct {
    id;
    cdk;
    props;
    _customDomainUrl;
    functionsByDsKey = {};
    dataSourcesByDsKey = {};
    dsKeysByResKey = {};
    resolversByResKey = {};
    bindingForAllFunctions = [];
    permissionsAttachedForAllFunctions = [];
    constructor(scope, id, props) {
        super(scope, props?.cdk?.id || id);
        this.id = id;
        this.props = props;
        this.cdk = {};
        this.createGraphApi();
        // Configure data sources
        if (props?.dataSources) {
            for (const key of Object.keys(props.dataSources)) {
                this.addDataSource(this, key, props.dataSources[key]);
            }
        }
        // Configure resolvers
        if (props?.resolvers) {
            for (const key of Object.keys(props.resolvers)) {
                this.addResolver(this, key, props.resolvers[key]);
            }
        }
        const app = this.node.root;
        app.registerTypes(this);
    }
    /**
     * The Id of the internally created AppSync GraphQL API.
     */
    get apiId() {
        return this.cdk.graphqlApi.apiId;
    }
    /**
     * The ARN of the internally created AppSync GraphQL API.
     */
    get apiArn() {
        return this.cdk.graphqlApi.arn;
    }
    /**
     * The name of the internally created AppSync GraphQL API.
     */
    get apiName() {
        return this.cdk.graphqlApi.name;
    }
    /**
     * The AWS generated URL of the Api.
     */
    get url() {
        return this.cdk.graphqlApi.graphqlUrl;
    }
    /**
     * If custom domain is enabled, this is the custom domain URL of the Api.
     */
    get customDomainUrl() {
        return this._customDomainUrl;
    }
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
    addDataSources(scope, dataSources) {
        Object.keys(dataSources).forEach((key) => {
            this.addDataSource(scope, key, dataSources[key]);
        });
    }
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
    addResolvers(scope, resolvers) {
        Object.keys(resolvers).forEach((key) => {
            this.addResolver(scope, key, resolvers[key]);
        });
    }
    /**
     * Get the instance of the internally created Function, for a given resolver.
     *
     * @example
     * ```js
     * const func = api.getFunction("Mutation charge");
     * ```
     */
    getFunction(key) {
        let fn = this.functionsByDsKey[key];
        if (!fn) {
            const resKey = this.normalizeResolverKey(key);
            const dsKey = this.dsKeysByResKey[resKey];
            fn = this.functionsByDsKey[dsKey];
        }
        return fn;
    }
    /**
     * Get a datasource by name
     * @example
     * ```js
     * api.getDataSource("billingDS");
     * ```
     */
    getDataSource(key) {
        let ds = this.dataSourcesByDsKey[key];
        if (!ds) {
            const resKey = this.normalizeResolverKey(key);
            const dsKey = this.dsKeysByResKey[resKey];
            ds = this.dataSourcesByDsKey[dsKey];
        }
        return ds;
    }
    /**
     * Get a resolver
     *
     * @example
     * ```js
     * api.getResolver("Mutation charge");
     * ```
     */
    getResolver(key) {
        const resKey = this.normalizeResolverKey(key);
        return this.resolversByResKey[resKey];
    }
    /**
     * Binds the given list of resources to all function data sources.
     *
     * @example
     *
     * ```js
     * api.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs) {
        Object.values(this.functionsByDsKey).forEach((fn) => fn.bind(constructs));
        this.bindingForAllFunctions.push(...constructs);
    }
    /**
     * Binds the given list of resources to a specific function data source.
     *
     * @example
     * ```js
     * api.bindToDataSource("Mutation charge", [STRIPE_KEY, bucket]);
     * ```
     *
     */
    bindToDataSource(key, constructs) {
        const fn = this.getFunction(key);
        if (!fn) {
            throw new Error(`Failed to bind resources. Function does not exist for key "${key}".`);
        }
        fn.bind(constructs);
    }
    /**
     * Attaches the given list of permissions to all function data sources
     *
     * @example
     * ```js
     * api.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions) {
        Object.values(this.functionsByDsKey).forEach((fn) => fn.attachPermissions(permissions));
        this.permissionsAttachedForAllFunctions.push(permissions);
    }
    /**
     * Attaches the given list of permissions to a specific function datasource. This allows that function to access other AWS resources.
     *
     * @example
     * ```js
     * api.attachPermissionsToDataSource("Mutation charge", ["s3"]);
     * ```
     */
    attachPermissionsToDataSource(key, permissions) {
        const fn = this.getFunction(key);
        if (!fn) {
            throw new Error(`Failed to attach permissions. Function does not exist for key "${key}".`);
        }
        fn.attachPermissions(permissions);
    }
    getConstructMetadata() {
        return {
            type: "AppSync",
            data: {
                url: this.cdk.graphqlApi.graphqlUrl,
                appSyncApiId: this.cdk.graphqlApi.apiId,
                appSyncApiKey: this.cdk.graphqlApi.apiKey,
                customDomainUrl: this._customDomainUrl,
                dataSources: Object.entries(this.dataSourcesByDsKey).map(([key]) => ({
                    name: key,
                    fn: getFunctionRef(this.functionsByDsKey[key]),
                })),
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        // Do not bind imported AppSync APIs b/c we don't know the API URL
        if (!this.url) {
            return;
        }
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
    createGraphApi() {
        const { schema, customDomain, cdk } = this.props;
        const id = this.node.id;
        const app = this.node.root;
        if (isCDKConstruct(cdk?.graphqlApi)) {
            if (customDomain !== undefined) {
                throw new Error(`Cannot configure the "customDomain" when "graphqlApi" is a construct`);
            }
            this.cdk.graphqlApi = cdk?.graphqlApi;
        }
        else {
            const graphqlApiProps = (cdk?.graphqlApi ||
                {});
            // build schema
            let mainSchema;
            if (!schema) {
                throw new Error(`Missing "schema" in "${id}" AppSyncApi`);
            }
            else if (typeof schema === "string") {
                mainSchema = SchemaFile.fromAsset(schema);
            }
            else {
                if (schema.length === 0) {
                    throw new Error("Invalid schema. At least one schema file must be provided");
                }
                // merge schema files
                const mergedSchema = mergeTypeDefs(schema.map((file) => fs.readFileSync(file).toString()));
                const filePath = path.join(useProject().paths.out, `appsyncapi-${id}-${this.node.addr}.graphql`);
                fs.writeFileSync(filePath, print(mergedSchema));
                mainSchema = SchemaFile.fromAsset(filePath);
            }
            // build domain
            const domainData = appSyncApiDomain.buildCustomDomainData(this, customDomain);
            this._customDomainUrl =
                domainData && `https://${domainData.domainName}/graphql`;
            this.cdk.graphqlApi = new GraphqlApi(this, "Api", {
                name: app.logicalPrefixedName(id),
                xrayEnabled: true,
                definition: Definition.fromSchema(mainSchema),
                domainName: domainData && {
                    certificate: domainData.certificate,
                    domainName: domainData.domainName,
                },
                ...graphqlApiProps,
            });
            this.cdk.certificate = domainData?.certificate;
            if (domainData) {
                appSyncApiDomain.cleanup(this, domainData);
            }
        }
    }
    addDataSource(scope, dsKey, dsValue) {
        let dataSource;
        let lambda;
        // Lambda function
        if (Fn.isInlineDefinition(dsValue)) {
            lambda = Fn.fromDefinition(scope, `Lambda_${dsKey}`, dsValue, this.props.defaults?.function, `Cannot define defaults.function when a Function is passed in to the "${dsKey} data source`);
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addLambdaDataSource(dsKey, lambda)
                : new LambdaDataSource(scope, dsKey, {
                    api: this.cdk.graphqlApi,
                    lambdaFunction: lambda,
                });
        }
        // DynamoDb ds
        else if (dsValue.type === "dynamodb") {
            const dsTable = dsValue.table
                ? dsValue.table.cdk.table
                : dsValue.cdk?.dataSource?.table;
            const dsOptions = {
                name: dsValue.name,
                description: dsValue.description,
            };
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addDynamoDbDataSource(dsKey, dsTable, dsOptions)
                : new DynamoDbDataSource(scope, dsKey, {
                    api: this.cdk.graphqlApi,
                    table: dsTable,
                    ...dsOptions,
                });
        }
        // RDS ds
        else if (dsValue.type === "rds") {
            const dsCluster = dsValue.rds
                ? dsValue.rds.cdk.cluster
                : dsValue.cdk?.dataSource?.serverlessCluster;
            const dsSecret = dsValue.rds
                ? dsValue.rds.cdk.cluster.secret
                : dsValue.cdk?.dataSource?.secretStore;
            const dsDatabaseName = dsValue.rds
                ? dsValue.databaseName || dsValue.rds.defaultDatabaseName
                : dsValue.cdk?.dataSource?.databaseName;
            const dsOptions = {
                name: dsValue.name,
                description: dsValue.description,
            };
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addRdsDataSource(dsKey, dsCluster, dsSecret, dsDatabaseName, dsOptions)
                : new RdsDataSource(scope, dsKey, {
                    api: this.cdk.graphqlApi,
                    serverlessCluster: dsCluster,
                    secretStore: dsSecret,
                    databaseName: dsDatabaseName,
                    ...dsOptions,
                });
        }
        // OpenSearch ds
        else if (dsValue.type === "open_search") {
            const dsOptions = {
                name: dsValue.name,
                description: dsValue.description,
            };
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addOpenSearchDataSource(dsKey, dsValue.cdk?.dataSource?.domain, dsOptions)
                : new OpenSearchDataSource(scope, dsKey, {
                    api: this.cdk.graphqlApi,
                    domain: dsValue.cdk?.dataSource?.domain,
                    ...dsOptions,
                });
        }
        // Http ds
        else if (dsValue.type === "http") {
            const dsOptions = {
                name: dsValue.name,
                description: dsValue.description,
            };
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addHttpDataSource(dsKey, dsValue.endpoint, dsOptions)
                : new HttpDataSource(scope, dsKey, {
                    api: this.cdk.graphqlApi,
                    endpoint: dsValue.endpoint,
                    ...dsOptions,
                });
        }
        // Http ds
        else if (dsValue.type === "none") {
            const dsOptions = {
                name: dsValue.name,
                description: dsValue.description,
            };
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addNoneDataSource(dsKey, dsOptions)
                : new NoneDataSource(scope, dsKey, {
                    api: this.cdk.graphqlApi,
                    ...dsOptions,
                });
        }
        // Lambda ds
        else {
            lambda = Fn.fromDefinition(scope, `Lambda_${dsKey}`, dsValue.function, this.props.defaults?.function, `Cannot define defaults.function when a Function is passed in to the "${dsKey} data source`);
            const dsOptions = {
                name: dsValue.name,
                description: dsValue.description,
            };
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addLambdaDataSource(dsKey, lambda, dsOptions)
                : new LambdaDataSource(scope, dsKey, {
                    api: this.cdk.graphqlApi,
                    lambdaFunction: lambda,
                    ...dsOptions,
                });
        }
        this.dataSourcesByDsKey[dsKey] = dataSource;
        if (lambda) {
            this.functionsByDsKey[dsKey] = lambda;
            // attached existing permissions
            this.permissionsAttachedForAllFunctions.forEach((permissions) => lambda.attachPermissions(permissions));
            lambda.bind(this.bindingForAllFunctions);
        }
    }
    addResolver(scope, resKey, resValue) {
        // Normalize resKey
        resKey = this.normalizeResolverKey(resKey);
        // Get type and field
        const resolverKeyParts = resKey.split(" ");
        if (resolverKeyParts.length !== 2) {
            throw new Error(`Invalid resolver ${resKey}`);
        }
        const [typeName, fieldName] = resolverKeyParts;
        if (fieldName.length === 0) {
            throw new Error(`Invalid field defined for "${resKey}"`);
        }
        ///////////////////
        // Create data source if not created before
        ///////////////////
        let lambda;
        let dataSource;
        let dataSourceKey;
        let resolverProps;
        // DataSource key
        if (typeof resValue === "string" &&
            Object.keys(this.dataSourcesByDsKey).includes(resValue)) {
            dataSourceKey = resValue;
            dataSource = this.dataSourcesByDsKey[resValue];
            resolverProps = {};
        }
        // DataSource key not exist (string does not have a dot, assume it is referencing a data store)
        else if (typeof resValue === "string" && resValue.indexOf(".") === -1) {
            throw new Error(`Failed to create resolver "${resKey}". Data source "${resValue}" does not exist.`);
        }
        // Lambda resolver
        else if (this.isLambdaResolverProps(resValue)) {
            resValue = resValue;
            lambda = Fn.fromDefinition(scope, `Lambda_${typeName}_${fieldName}`, resValue.function, this.props.defaults?.function, `Cannot define defaults.function when a Function is passed in to the "${resKey} resolver`);
            dataSourceKey = this.buildDataSourceKey(typeName, fieldName);
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addLambdaDataSource(dataSourceKey, lambda)
                : new LambdaDataSource(scope, dataSourceKey, {
                    api: this.cdk.graphqlApi,
                    lambdaFunction: lambda,
                });
            resolverProps = {
                requestMappingTemplate: this.buildMappingTemplate(resValue.requestMapping),
                responseMappingTemplate: this.buildMappingTemplate(resValue.responseMapping),
                ...resValue.cdk?.resolver,
            };
        }
        // DataSource resolver
        else if (this.isDataSourceResolverProps(resValue)) {
            resValue = resValue;
            dataSourceKey = resValue.dataSource;
            dataSource = this.dataSourcesByDsKey[dataSourceKey];
            resolverProps = {
                requestMappingTemplate: this.buildMappingTemplate(resValue.requestMapping),
                responseMappingTemplate: this.buildMappingTemplate(resValue.responseMapping),
                ...resValue.cdk?.resolver,
            };
        }
        // Lambda function
        else {
            resValue = resValue;
            lambda = Fn.fromDefinition(scope, `Lambda_${typeName}_${fieldName}`, resValue, this.props.defaults?.function, `Cannot define defaults.function when a Function is passed in to the "${resKey} resolver`);
            dataSourceKey = this.buildDataSourceKey(typeName, fieldName);
            dataSource = this.isSameStack(scope)
                ? this.cdk.graphqlApi.addLambdaDataSource(dataSourceKey, lambda)
                : new LambdaDataSource(scope, dataSourceKey, {
                    api: this.cdk.graphqlApi,
                    lambdaFunction: lambda,
                });
            resolverProps = {};
        }
        if (lambda) {
            // Store new data source created
            this.dataSourcesByDsKey[dataSourceKey] = dataSource;
            this.functionsByDsKey[dataSourceKey] = lambda;
            // attached existing permissions
            this.permissionsAttachedForAllFunctions.forEach((permissions) => lambda.attachPermissions(permissions));
            lambda.bind(this.bindingForAllFunctions);
        }
        this.dsKeysByResKey[resKey] = dataSourceKey;
        ///////////////////
        // Create resolver
        ///////////////////
        const resolver = this.isSameStack(scope)
            ? this.cdk.graphqlApi.createResolver(`${typeName}${fieldName}Resolver`, {
                dataSource,
                typeName,
                fieldName,
                ...resolverProps,
            })
            : new Resolver(scope, `${typeName}${fieldName}Resolver`, {
                api: this.cdk.graphqlApi,
                dataSource,
                typeName,
                fieldName,
                ...resolverProps,
            });
        this.resolversByResKey[resKey] = resolver;
        return lambda;
    }
    isLambdaResolverProps(object) {
        return object.function !== undefined;
    }
    isDataSourceResolverProps(object) {
        return object.dataSource !== undefined;
    }
    normalizeResolverKey(resolverKey) {
        // remove extra spaces in the key
        return resolverKey.split(/\s+/).join(" ");
    }
    buildMappingTemplate(mapping) {
        if (!mapping) {
            return undefined;
        }
        if (mapping.file) {
            return CDKMappingTemplate.fromFile(mapping.file);
        }
        return CDKMappingTemplate.fromString(mapping.inline);
    }
    buildDataSourceKey(typeName, fieldName) {
        return `LambdaDS_${typeName}_${fieldName}`;
    }
    isSameStack(scope) {
        return Stack.of(this) === Stack.of(scope);
    }
}
