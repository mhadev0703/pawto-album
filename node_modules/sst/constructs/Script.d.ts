import { Construct } from "constructs";
import { Function as Fn, FunctionProps, FunctionDefinition } from "./Function.js";
import { SSTConstruct } from "./Construct.js";
import { Permissions } from "./util/permission.js";
export interface ScriptProps {
    /**
     * An object of input parameters to be passed to the script. Made available in the `event` object of the function.
     *
     * @example
     * ```js
     * import { Script } from "sst/constructs";
     *
     * new Script(stack, "Script", {
     *   onCreate: "src/function.create",
     *   params: {
     *     hello: "world",
     *   },
     * });
     * ```
     */
    params?: Record<string, any>;
    /**
     * By default, the `onUpdate` function runs during each deployment. If a version is provided, it will only run when the version changes.
     *
     * @example
     * ```js
     * import { Script } from "sst/constructs";
     *
     * new Script(stack, "Script", {
     *   onUpdate: "src/function.update",
     *   version: "v17",
     * });
     * ```
     */
    version?: string;
    defaults?: {
        /**
         * The default function props to be applied to all the Lambda functions in the API. The `environment`, `permissions` and `layers` properties will be merged with per route definitions if they are defined.
         *
         * @example
         * ```js
         * new Script(stack, "Api", {
         *   defaults: {
         *     function: {
         *       timeout: 20,
         *     }
         *   }
         * });
         * ```
         */
        function?: FunctionProps;
    };
    /**
     * Specifies the function to be run once when the Script construct is added to the stack or when the entire stack is deployed for the first time.
     * @example
     * ```js
     * new Script(stack, "Api", {
     *   onCreate: "src/function.create",
     * })
     * ```
     */
    onCreate?: FunctionDefinition;
    /**
     * Specifies the function to be run each time the Script construct is redeployed. If a version is provided, the function is only executed when the version changes.
     *
     * Note that the `onUpdate` function is not run during the initial creation of the Script construct.
     * For initial creation, use `onCreate`.
     * @example
     * ```js
     * new Script(stack, "Api", {
     *   onUpdate: "src/function.update",
     * })
     * ```
     */
    onUpdate?: FunctionDefinition;
    /**
     * Specifies the function to be run once when the Script construct is deleted from the stack or when the entire stack is removed from the app.
     * @example
     * ```js
     * new Script(stack, "Api", {
     *   onDelete: "src/function.delete",
     * })
     * ```
     */
    onDelete?: FunctionDefinition;
}
/**
 * The `Script` construct is a higher level CDK construct that makes it easy to run a script in a Lambda function during the deployment process.
 *
 * @example
 *
 * ```js
 * import { Script } from "sst/constructs";
 *
 * new Script(stack, "Script", {
 *   onCreate: "src/function.create",
 *   onUpdate: "src/function.update",
 *   onDelete: "src/function.delete",
 * });
 * ```
 */
export declare class Script extends Construct implements SSTConstruct {
    /**
     * The internally created onCreate `Function` instance.
     */
    readonly createFunction?: Fn;
    /**
     * The internally created onUpdate `Function` instance.
     */
    readonly updateFunction?: Fn;
    /**
     * The internally created onDelete `Function` instance.
     */
    readonly deleteFunction?: Fn;
    protected readonly props: ScriptProps;
    readonly id: string;
    constructor(scope: Construct, id: string, props: ScriptProps);
    /**
     * Binds additional resources to the script
     *
     * @example
     * ```js
     * script.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Grants additional permissions to the script
     *
     * @example
     * ```js
     * script.attachPermissions(["s3"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    protected createUserFunction(type: string, fnDef?: FunctionDefinition): Fn | undefined;
    private createCustomResourceFunction;
    private createCustomResource;
    private checkDeprecatedFunction;
    /** @internal */
    getConstructMetadata(): {
        type: "Script";
        data: {
            createfn: {
                node: string;
                stack: string;
            } | undefined;
            deletefn: {
                node: string;
                stack: string;
            } | undefined;
            updatefn: {
                node: string;
                stack: string;
            } | undefined;
        };
    };
    /** @internal */
    getFunctionBinding(): undefined;
}
