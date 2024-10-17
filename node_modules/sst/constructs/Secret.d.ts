import { Construct } from "constructs";
import { SSTConstruct } from "./Construct.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
/**
 * The `Secret` construct is a higher level CDK construct that makes it easy to manage app secrets.
 *
 * @example
 * ### Using the minimal config
 *
 * ```js
 * import { Config } from "sst/constructs";
 *
 * new Config.Secret(stack, "STRIPE_KEY");
 * ```
 */
export declare class Secret extends Construct implements SSTConstruct {
    readonly id: string;
    readonly name: string;
    constructor(scope: Construct, id: string);
    /** @internal */
    getConstructMetadata(): {
        type: "Secret";
        data: {
            name: string;
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    static create<T extends string[]>(scope: Construct, ...parameters: T): { [key in T[number]]: Secret; };
}
