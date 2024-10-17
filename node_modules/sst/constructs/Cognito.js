import { Construct } from "constructs";
import { Stack } from "./Stack.js";
import { getFunctionRef, isCDKConstruct } from "./Construct.js";
import { Function as Fn, } from "./Function.js";
import { attachPermissionsToRole, attachPermissionsToPolicy, } from "./util/permission.js";
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, UserPool, UserPoolClient, UserPoolOperation, } from "aws-cdk-lib/aws-cognito";
import { Effect, FederatedPrincipal, OpenIdConnectProvider, Policy, PolicyStatement, Role, } from "aws-cdk-lib/aws-iam";
const CognitoUserPoolTriggerOperationMapping = {
    createAuthChallenge: UserPoolOperation.CREATE_AUTH_CHALLENGE,
    customEmailSender: UserPoolOperation.CUSTOM_EMAIL_SENDER,
    customMessage: UserPoolOperation.CUSTOM_MESSAGE,
    customSmsSender: UserPoolOperation.CUSTOM_SMS_SENDER,
    defineAuthChallenge: UserPoolOperation.DEFINE_AUTH_CHALLENGE,
    postAuthentication: UserPoolOperation.POST_AUTHENTICATION,
    postConfirmation: UserPoolOperation.POST_CONFIRMATION,
    preAuthentication: UserPoolOperation.PRE_AUTHENTICATION,
    preSignUp: UserPoolOperation.PRE_SIGN_UP,
    preTokenGeneration: UserPoolOperation.PRE_TOKEN_GENERATION,
    userMigration: UserPoolOperation.USER_MIGRATION,
    verifyAuthChallengeResponse: UserPoolOperation.VERIFY_AUTH_CHALLENGE_RESPONSE,
};
/////////////////////
// Construct
/////////////////////
/**
 * The `Cognito` construct is a higher level CDK construct that makes it easy to configure a Cognito User Pool and Cognito Identity Pool.
 *
 * @example
 *
 * ```js
 * import { Cognito } from "sst/constructs";
 *
 * new Cognito(stack, "Cognito");
 * ```
 */
export class Cognito extends Construct {
    id;
    cdk;
    functions = {};
    props;
    constructor(scope, id, props) {
        super(scope, props?.cdk?.id || id);
        this.id = id;
        this.props = props || {};
        this.cdk = {};
        this.createUserPool();
        this.createUserPoolClient();
        this.addTriggers();
        this.createIdentityPool();
        const app = this.node.root;
        app.registerTypes(this);
    }
    /**
     * The id of the internally created Cognito User Pool.
     */
    get userPoolId() {
        return this.cdk.userPool.userPoolId;
    }
    /**
     * The ARN of the internally created Cognito User Pool.
     */
    get userPoolArn() {
        return this.cdk.userPool.userPoolArn;
    }
    /**
     * The id of the internally created Cognito User Pool client.
     */
    get userPoolClientId() {
        return this.cdk.userPoolClient.userPoolClientId;
    }
    /**
     * The id of the internally created `IdentityPool` instance.
     */
    get cognitoIdentityPoolId() {
        return this.cdk.cfnIdentityPool?.ref;
    }
    attachPermissionsForAuthUsers(arg1, arg2) {
        return this.attachPermissionsForUsers(this.cdk.authRole, arg1, arg2);
    }
    attachPermissionsForUnauthUsers(arg1, arg2) {
        return this.attachPermissionsForUsers(this.cdk.unauthRole, arg1, arg2);
    }
    bindForTriggers(constructs) {
        Object.values(this.functions).forEach((fn) => fn.bind(constructs));
    }
    bindForTrigger(triggerKey, constructs) {
        const fn = this.getFunction(triggerKey);
        if (!fn) {
            throw new Error(`Failed to bind resources. Trigger "${triggerKey}" does not exist.`);
        }
        fn.bind(constructs);
    }
    attachPermissionsForTriggers(permissions) {
        Object.values(this.functions).forEach((fn) => fn.attachPermissions(permissions));
    }
    attachPermissionsForTrigger(triggerKey, permissions) {
        const fn = this.getFunction(triggerKey);
        if (!fn) {
            throw new Error(`Failed to attach permissions. Trigger "${triggerKey}" does not exist.`);
        }
        fn.attachPermissions(permissions);
    }
    getFunction(triggerKey) {
        return this.functions[triggerKey];
    }
    getConstructMetadata() {
        return {
            type: "Cognito",
            data: {
                identityPoolId: this.cdk.cfnIdentityPool?.ref,
                userPoolId: this.cdk.userPool.userPoolId,
                triggers: Object.entries(this.functions).map(([name, fun]) => ({
                    name,
                    fn: getFunctionRef(fun),
                })),
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        return undefined;
    }
    attachPermissionsForUsers(role, arg1, arg2) {
        let scope;
        let permissions;
        if (arg2) {
            scope = arg1;
            permissions = arg2;
        }
        else {
            scope = this;
            permissions = arg1;
        }
        // If the scope is within the same stack as the `Auth` construct, attach the permissions
        // directly to the auth role.
        if (Stack.of(scope) === Stack.of(this)) {
            attachPermissionsToRole(role, permissions);
        }
        // If the scope is within a different stack, we need to create a new role and attach the permissions to that role.
        else {
            const policyId = role === this.cdk.authRole
                ? `Auth-${this.node.id}-${scope.node.id}-AuthRole`
                : `Auth-${this.node.id}-${scope.node.id}-UnauthRole`;
            let policy = scope.node.tryFindChild(policyId);
            if (!policy) {
                policy = new Policy(scope, policyId);
            }
            role.attachInlinePolicy(policy);
            attachPermissionsToPolicy(policy, permissions);
        }
    }
    createUserPool() {
        const { login, cdk } = this.props;
        const app = this.node.root;
        if (isCDKConstruct(cdk?.userPool)) {
            this.cdk.userPool = cdk?.userPool;
        }
        else {
            const cognitoUserPoolProps = (cdk?.userPool || {});
            // validate `lambdaTriggers` is not specified
            if (cognitoUserPoolProps.lambdaTriggers) {
                throw new Error(`Cannot configure the "cdk.userPool.lambdaTriggers" in the Cognito construct. Use the "triggers" instead.`);
            }
            // validate `cdk.userPoolClient` is not imported
            if (isCDKConstruct(cdk?.userPoolClient)) {
                throw new Error(`Cannot import the "userPoolClient" when the "userPool" is not imported.`);
            }
            this.cdk.userPool = new UserPool(this, "UserPool", {
                userPoolName: app.logicalPrefixedName(this.node.id),
                selfSignUpEnabled: true,
                signInCaseSensitive: false,
                signInAliases: this.buildSignInAliases(login),
                ...cognitoUserPoolProps,
            });
        }
    }
    createUserPoolClient() {
        const { cdk } = this.props;
        if (isCDKConstruct(cdk?.userPoolClient)) {
            this.cdk.userPoolClient = cdk?.userPoolClient;
        }
        else {
            const clientProps = (cdk?.userPoolClient || {});
            this.cdk.userPoolClient = new UserPoolClient(this, "UserPoolClient", {
                userPool: this.cdk.userPool,
                ...clientProps,
            });
        }
    }
    createIdentityPool() {
        const { identityPoolFederation } = this.props;
        if (identityPoolFederation === false) {
            return;
        }
        const id = this.node.id;
        const app = this.node.root;
        const cognitoIdentityProviders = [];
        const openIdConnectProviderArns = [];
        const supportedLoginProviders = {};
        ////////////////////
        // Handle Cognito Identity Providers (ie. User Pool)
        ////////////////////
        const urlSuffix = Stack.of(this).urlSuffix;
        cognitoIdentityProviders.push({
            providerName: `cognito-idp.${app.region}.${urlSuffix}/${this.cdk.userPool.userPoolId}`,
            clientId: this.cdk.userPoolClient.userPoolClientId,
        });
        if (typeof identityPoolFederation === "object") {
            const { auth0, amazon, apple, facebook, google, twitter } = identityPoolFederation;
            ////////////////////
            // Handle OpenId Connect Providers (ie. Cognito)
            ////////////////////
            if (auth0) {
                if (!auth0.domain) {
                    throw new Error(`Auth0Domain: No Auth0 domain defined for the "${id}" Auth`);
                }
                if (!auth0.clientId) {
                    throw new Error(`Auth0ClientId: No Auth0 clientId defined for the "${id}" Auth`);
                }
                const provider = new OpenIdConnectProvider(this, "Auth0Provider", {
                    url: auth0.domain.startsWith("https://")
                        ? auth0.domain
                        : `https://${auth0.domain}`,
                    clientIds: [auth0.clientId],
                });
                openIdConnectProviderArns.push(provider.openIdConnectProviderArn);
            }
            ////////////////////
            // Handle Social Identity Providers
            ////////////////////
            if (amazon) {
                if (!amazon.appId) {
                    throw new Error(`AmazonAppId: No Amazon appId defined for the "${id}" Auth`);
                }
                supportedLoginProviders["www.amazon.com"] = amazon.appId;
            }
            if (facebook) {
                if (!facebook.appId) {
                    throw new Error(`FacebookAppId: No Facebook appId defined for the "${id}" Auth`);
                }
                supportedLoginProviders["graph.facebook.com"] = facebook.appId;
            }
            if (google) {
                if (!google.clientId) {
                    throw new Error(`GoogleClientId: No Google appId defined for the "${id}" Auth`);
                }
                supportedLoginProviders["accounts.google.com"] = google.clientId;
            }
            if (twitter) {
                if (!twitter.consumerKey) {
                    throw new Error(`TwitterConsumerKey: No Twitter consumer key defined for the "${id}" Auth`);
                }
                if (!twitter.consumerSecret) {
                    throw new Error(`TwitterConsumerSecret: No Twitter consumer secret defined for the "${id}" Auth`);
                }
                supportedLoginProviders["api.twitter.com"] = `${twitter.consumerKey};${twitter.consumerSecret}`;
            }
            if (apple) {
                if (!apple.servicesId) {
                    throw new Error(`AppleServicesId: No Apple servicesId defined for the "${id}" Auth`);
                }
                supportedLoginProviders["appleid.apple.com"] = apple.servicesId;
            }
        }
        // Create Cognito Identity Pool
        const identityPoolProps = typeof identityPoolFederation === "object"
            ? identityPoolFederation.cdk?.cfnIdentityPool || {}
            : {};
        this.cdk.cfnIdentityPool = new CfnIdentityPool(this, "IdentityPool", {
            identityPoolName: app.logicalPrefixedName(id),
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders,
            supportedLoginProviders,
            openIdConnectProviderArns,
            ...identityPoolProps,
        });
        this.cdk.authRole = this.createAuthRole(this.cdk.cfnIdentityPool);
        this.cdk.unauthRole = this.createUnauthRole(this.cdk.cfnIdentityPool);
        // Attach roles to Identity Pool
        this.cdk.cfnIdentityPoolRoleAttachment = new CfnIdentityPoolRoleAttachment(this, "IdentityPoolRoleAttachment", {
            identityPoolId: this.cdk.cfnIdentityPool.ref,
            roles: {
                authenticated: this.cdk.authRole.roleArn,
                unauthenticated: this.cdk.unauthRole.roleArn,
            },
        });
    }
    addTriggers() {
        const { triggers, defaults } = this.props;
        if (!triggers || Object.keys(triggers).length === 0) {
            return;
        }
        // Validate cognito user pool is not imported
        // ie. imported IUserPool does not have the "addTrigger" function
        if (!this.cdk.userPool.addTrigger) {
            throw new Error(`Cannot add triggers when the "userPool" is imported.`);
        }
        Object.entries(triggers).forEach(([triggerKey, triggerValue]) => this.addTrigger(this, triggerKey, triggerValue, defaults?.function));
    }
    addTrigger(scope, triggerKey, triggerValue, functionProps) {
        // Validate cognito user pool is defined
        if (!this.cdk.userPool) {
            throw new Error(`Triggers cannot be added. No Cognito UserPool defined for the Cognito construct.`);
        }
        // Create Function
        const lambda = Fn.fromDefinition(scope, triggerKey, triggerValue, functionProps, `The "defaults.function" cannot be applied if an instance of a Function construct is passed in. Make sure to define all the triggers using FunctionProps, so the Cognito construct can apply the "defaults.function" to them.`);
        // Create trigger
        const operation = CognitoUserPoolTriggerOperationMapping[triggerKey];
        this.cdk.userPool.addTrigger(operation, lambda);
        // Store function
        this.functions[triggerKey] = lambda;
        return lambda;
    }
    createAuthRole(identityPool) {
        const identityName = this.cognitoIdentityName();
        const role = new Role(this, "IdentityPoolAuthRole", {
            assumedBy: new FederatedPrincipal(identityName, {
                StringEquals: {
                    [`${identityName}:aud`]: identityPool.ref,
                },
                "ForAnyValue:StringLike": {
                    [`${identityName}:amr`]: "authenticated",
                },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        role.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "mobileanalytics:PutEvents",
                "cognito-sync:*",
                "cognito-identity:*",
            ],
            resources: ["*"],
        }));
        return role;
    }
    createUnauthRole(identityPool) {
        const identityName = this.cognitoIdentityName();
        const role = new Role(this, "IdentityPoolUnauthRole", {
            assumedBy: new FederatedPrincipal(identityName, {
                StringEquals: {
                    [`${identityName}:aud`]: identityPool.ref,
                },
                "ForAnyValue:StringLike": {
                    [`${identityName}:amr`]: "unauthenticated",
                },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        role.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["mobileanalytics:PutEvents", "cognito-sync:*"],
            resources: ["*"],
        }));
        return role;
    }
    buildSignInAliases(login) {
        if (!login) {
            return;
        }
        return {
            email: login.includes("email"),
            phone: login.includes("phone"),
            username: login.includes("username"),
            preferredUsername: login.includes("preferredUsername"),
        };
    }
    cognitoIdentityName() {
        return Stack.of(this).region.startsWith("us-gov-")
            ? "cognito-identity-us-gov.amazonaws.com"
            : "cognito-identity.amazonaws.com";
    }
}
