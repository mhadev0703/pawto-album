import { Construct } from "constructs";
import { SSTConstruct } from "./Construct.js";
import { Function as Fn, FunctionProps, FunctionDefinition } from "./Function.js";
import { Permissions } from "./util/permission.js";
import { CfnIdentityPool, CfnIdentityPoolProps, CfnIdentityPoolRoleAttachment, IUserPool, IUserPoolClient, UserPoolClientOptions, UserPoolProps } from "aws-cdk-lib/aws-cognito";
import { Role } from "aws-cdk-lib/aws-iam";
export interface CognitoUserPoolTriggers {
    createAuthChallenge?: FunctionDefinition;
    customEmailSender?: FunctionDefinition;
    customMessage?: FunctionDefinition;
    customSmsSender?: FunctionDefinition;
    defineAuthChallenge?: FunctionDefinition;
    postAuthentication?: FunctionDefinition;
    postConfirmation?: FunctionDefinition;
    preAuthentication?: FunctionDefinition;
    preSignUp?: FunctionDefinition;
    preTokenGeneration?: FunctionDefinition;
    userMigration?: FunctionDefinition;
    verifyAuthChallengeResponse?: FunctionDefinition;
}
export interface CognitoAuth0Props {
    domain: string;
    clientId: string;
}
export interface CognitoAmazonProps {
    appId: string;
}
export interface CognitoAppleProps {
    servicesId: string;
}
export interface CognitoFacebookProps {
    appId: string;
}
export interface CognitoGoogleProps {
    clientId: string;
}
export interface CognitoTwitterProps {
    consumerKey: string;
    consumerSecret: string;
}
export interface CognitoCdkCfnIdentityPoolProps extends Omit<CfnIdentityPoolProps, "allowUnauthenticatedIdentities"> {
    allowUnauthenticatedIdentities?: boolean;
}
export interface CognitoIdentityPoolFederationProps {
    auth0?: CognitoAuth0Props;
    amazon?: CognitoAmazonProps;
    apple?: CognitoAppleProps;
    facebook?: CognitoFacebookProps;
    google?: CognitoGoogleProps;
    twitter?: CognitoTwitterProps;
    cdk?: {
        cfnIdentityPool?: CognitoCdkCfnIdentityPoolProps;
    };
}
export interface CognitoProps {
    defaults?: {
        /**
         * The default function props to be applied to all the triggers in the UserPool. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         *
         * ```js
         * new Cognito(stack, "Auth", {
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
     * Configure the different ways a user can sign in to our application for our User Pool. For example, you might want a user to be able to sign in with their email or username. Or with their phone number.
     *
     * :::caution
     * You cannot change the login property once the User Pool has been created.
     * :::
     *
     * @default `["username"]`
     */
    login?: ("email" | "phone" | "username" | "preferredUsername")[];
    /**
     * Configure triggers for this User Pool
     * @default No triggers
     *
     * @example
     *
     * ```js
     * new Cognito(stack, "Auth", {
     *   triggers: {
     *     preAuthentication: "src/preAuthentication.main",
     *     postAuthentication: "src/postAuthentication.main",
     *   },
     * });
     * ```
     */
    triggers?: CognitoUserPoolTriggers;
    /**
     * Configure the Cognito Identity Pool and its authentication providers.
     * @default Identity Pool created with the User Pool as the authentication provider
     */
    identityPoolFederation?: boolean | CognitoIdentityPoolFederationProps;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * This allows you to override the default settings this construct uses internally to create the User Pool.
         */
        userPool?: UserPoolProps | IUserPool;
        /**
         * This allows you to override the default settings this construct uses internally to create the User Pool client.
         */
        userPoolClient?: UserPoolClientOptions | IUserPoolClient;
    };
}
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
export declare class Cognito extends Construct implements SSTConstruct {
    readonly id: string;
    readonly cdk: {
        userPool: IUserPool;
        userPoolClient: IUserPoolClient;
        cfnIdentityPool?: CfnIdentityPool;
        cfnIdentityPoolRoleAttachment?: CfnIdentityPoolRoleAttachment;
        authRole: Role;
        unauthRole: Role;
    };
    private functions;
    private props;
    constructor(scope: Construct, id: string, props?: CognitoProps);
    /**
     * The id of the internally created Cognito User Pool.
     */
    get userPoolId(): string;
    /**
     * The ARN of the internally created Cognito User Pool.
     */
    get userPoolArn(): string;
    /**
     * The id of the internally created Cognito User Pool client.
     */
    get userPoolClientId(): string;
    /**
     * The id of the internally created `IdentityPool` instance.
     */
    get cognitoIdentityPoolId(): string | undefined;
    /**
     * Attaches the given list of permissions to the authenticated users. This allows the authenticated users to access other AWS resources.
     *
     * @example
     * ```js
     * auth.attachPermissionsForAuthUsers(stack, ["s3"]);
     * ```
     */
    attachPermissionsForAuthUsers(scope: Construct, permissions: Permissions): void;
    /**
     * @deprecated You are now required to pass in a scope as the first argument.
     *
     * ```js
     * // Change
     * auth.attachPermissionsForAuthUsers(["s3"]);
     * // to
     * auth.attachPermissionsForAuthUsers(auth, ["s3"]);
     * ```
     */
    attachPermissionsForAuthUsers(permissions: Permissions): void;
    /**
     * Attaches the given list of permissions to the authenticated users. This allows the authenticated users to access other AWS resources.
     *
     * @example
     * ```js
     * auth.attachPermissionsForUnauthUsers(stack, ["s3"]);
     * ```
     */
    attachPermissionsForUnauthUsers(scope: Construct, permissions: Permissions): void;
    /**
     * @deprecated You are now required to pass in a scope as the first argument.
     * ```js
     * // Change
     * auth.attachPermissionsForUnauthUsers(["s3"]);
     * // to
     * auth.attachPermissionsForUnauthUsers(auth, ["s3"]);
     * ```
     */
    attachPermissionsForUnauthUsers(permissions: Permissions): void;
    bindForTriggers(constructs: SSTConstruct[]): void;
    bindForTrigger(triggerKey: keyof CognitoUserPoolTriggers, constructs: SSTConstruct[]): void;
    attachPermissionsForTriggers(permissions: Permissions): void;
    attachPermissionsForTrigger(triggerKey: keyof CognitoUserPoolTriggers, permissions: Permissions): void;
    getFunction(triggerKey: keyof CognitoUserPoolTriggers): Fn | undefined;
    getConstructMetadata(): {
        type: "Cognito";
        data: {
            identityPoolId: string | undefined;
            userPoolId: string;
            triggers: {
                name: string;
                fn: {
                    node: string;
                    stack: string;
                } | undefined;
            }[];
        };
    };
    /** @internal */
    getFunctionBinding(): undefined;
    private attachPermissionsForUsers;
    private createUserPool;
    private createUserPoolClient;
    private createIdentityPool;
    private addTriggers;
    private addTrigger;
    private createAuthRole;
    private createUnauthRole;
    private buildSignInAliases;
    private cognitoIdentityName;
}
