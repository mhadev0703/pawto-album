import { Stacks } from "../../stacks/index.js";
import type { CloudAssembly } from "aws-cdk-lib/cx-api";
interface Props {
    assembly: CloudAssembly;
    remove?: boolean;
}
export declare const DeploymentUI: (props: Props) => JSX.Element;
export declare function printDeploymentResults(assembly: CloudAssembly, results: Awaited<ReturnType<typeof Stacks.deployMany>>, remove?: boolean): void;
export {};
