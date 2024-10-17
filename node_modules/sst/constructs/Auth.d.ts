import { Construct } from "constructs";
import { Api } from "./Api.js";
import { FunctionDefinition } from "./Function.js";
import { SSTConstruct } from "./Construct.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
export interface AuthProps {
    /**
     * The function that will handle authentication
     */
    authenticator: FunctionDefinition;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
    };
}
export interface ApiAttachmentProps {
    /**
     * The API to attach auth routes to
     *
     * @example
     * ```js
     * const api = new Api(stack, "Api", {});
     * const auth = new Auth(stack, "Auth", {
     *   authenticator: "functions/authenticator.handler"
     * })
     * auth.attach(stack, {
     *   api
     * })
     * ```
     */
    api: Api;
    /**
     * Optionally specify the prefix to mount authentication routes
     *
     * @default "/auth"
     *
     * @example
     * ```js
     * const api = new Api(stack, "Api", {});
     * const auth = new Auth(stack, "Auth", {
     *   authenticator: "functions/authenticator.handler"
     * })
     * auth.attach(stack, {
     *   api,
     *   prefix: "/custom/prefix"
     * })
     * ```
     */
    prefix?: string;
}
/**
 * SST Auth is a lightweight authentication solution for your applications. With a simple set of configuration you can deploy a function attached to your API that can handle various authentication flows.  *
 * @example
 * ```
 * import { Auth } from "sst/constructs"
 *
 * new Auth(stack, "auth", {
 *   authenticator: "functions/authenticator.handler"
 * })
 */
export declare class Auth extends Construct implements SSTConstruct {
    readonly id: string;
    private readonly authenticator;
    private readonly apis;
    /** @internal */
    static list: Set<Auth>;
    constructor(scope: Construct, id: string, props: AuthProps);
    /** @internal */
    getConstructMetadata(): {
        type: "Auth";
        data: {};
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    /**
     * Attaches auth construct to an API
     *
     * @example
     * ```js
     * const api = new Api(stack, "Api", {});
     * const auth = new Auth(stack, "Auth", {
     *   authenticator: "functions/authenticator.handler"
     * })
     * auth.attach(stack, {
     *   api
     * })
     * ```
     */
    attach(scope: Construct, props: ApiAttachmentProps): void;
    /**
     * @internal
     */
    injectConfig(): void;
    /**
     * @internal
     */
    static injectConfig(): void;
}
