import { Construct } from "constructs";
import { SSTConstruct } from "./Construct.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
export interface ParameterProps {
    /**
     * Value of the parameter
     */
    value: string;
}
/**
 * The `Parameter` construct is a higher level CDK construct that makes it easy to manage app environment variables.
 *
 * @example
 * ### Using the minimal config
 *
 * ```js
 * import { Config } from "sst/constructs";
 *
 * new Config.Parameter(stack, "TABLE_NAME", table.tableName);
 * ```
 */
export declare class Parameter extends Construct implements SSTConstruct {
    readonly id: string;
    readonly name: string;
    readonly value: string;
    constructor(scope: Construct, id: string, props: ParameterProps);
    /** @internal */
    getConstructMetadata(): {
        type: "Parameter";
        data: {
            name: string;
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    static create<T extends Record<string, any>>(scope: Construct, parameters: T): { [key in keyof T]: Parameter; };
}
