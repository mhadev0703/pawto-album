import { Construct } from "constructs";
import { StackProps as CDKStackProps, Stack as CDKStack, CfnOutputProps } from "aws-cdk-lib/core";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { FunctionProps, Function as Fn } from "./Function.js";
import { SSTConstruct } from "./Construct.js";
import { Permissions } from "./util/permission.js";
export type StackProps = CDKStackProps;
/**
 * The Stack construct extends cdk.Stack. It automatically prefixes the stack names with the stage and app name to ensure that they can be deployed to multiple regions in the same AWS account. It also ensure that the stack uses the same AWS profile and region as the app. They're defined using functions that return resources that can be imported by other stacks.
 *
 * @example
 *
 * ```js
 * import { StackContext } from "sst/constructs";
 *
 * export function MyStack({ stack }: StackContext) {
 *   // Define your stack
 * }
 * ```
 */
export declare class Stack extends CDKStack {
    /**
     * The current stage of the stack.
     */
    readonly stage: string;
    /**
     * @internal
     */
    readonly defaultFunctionProps: FunctionProps[];
    /**
     * Create a custom resource handler per stack. This handler will
     * be used by all the custom resources in the stack.
     * @internal
     */
    readonly customResourceHandler: lambda.Function;
    /**
     * Skip building Function/Site code when stack is not active
     * ie. `sst remove` and `sst deploy PATTERN` (pattern not matched)
     * @internal
     */
    readonly isActive: boolean;
    constructor(scope: Construct, id: string, props?: StackProps);
    /**
     * The default function props to be applied to all the Lambda functions in the stack.
     *
     * @example
     * ```js
     * stack.setDefaultFunctionProps({
     *   srcPath: "backend",
     *   runtime: "nodejs18.x",
     * });
     * ```
     */
    setDefaultFunctionProps(props: FunctionProps): void;
    /**
     * Adds additional default Permissions to be applied to all Lambda functions in the stack.
     *
     * @example
     * ```js
     * stack.addDefaultFunctionPermissions(["sqs", "s3"]);
     * ```
     */
    addDefaultFunctionPermissions(permissions: Permissions): void;
    /**
     * Adds additional default environment variables to be applied to all Lambda functions in the stack.
     *
     * @example
     * ```js
     * stack.addDefaultFunctionEnv({
     *   DYNAMO_TABLE: table.name
     * });
     * ```
     */
    addDefaultFunctionEnv(environment: Record<string, string>): void;
    /**
     * Binds additional resources to be applied to all Lambda functions in the stack.
     *
     * @example
     * ```js
     * app.addDefaultFunctionBinding([STRIPE_KEY, bucket]);
     * ```
     */
    addDefaultFunctionBinding(bind: SSTConstruct[]): void;
    /**
     * Adds additional default layers to be applied to all Lambda functions in the stack.
     *
     * @example
     * ```js
     * stack.addDefaultFunctionLayers(["arn:aws:lambda:us-east-1:123456789012:layer:nodejs:3"]);
     * ```
     */
    addDefaultFunctionLayers(layers: lambda.ILayerVersion[]): void;
    /**
     * Returns all the Function instances in this stack.
     *
     * @example
     * ```js
     * stack.getAllFunctions();
     * ```
     */
    getAllFunctions(): Fn[];
    private doGetAllFunctions;
    /**
     * Add outputs to this stack
     *
     * @example
     * ```js
     * stack.addOutputs({
     *   TableName: table.name,
     * });
     * ```
     *
     * ```js
     * stack.addOutputs({
     *   TableName: {
     *     value: table.name,
     *     exportName: "MyTableName",
     *   }
     * });
     * ```
     */
    addOutputs(outputs: Record<string, string | CfnOutputProps | undefined>): void;
    private createCustomResourceHandler;
    private static buildSynthesizer;
    private static checkForPropsIsConstruct;
    private static checkForEnvInProps;
}
