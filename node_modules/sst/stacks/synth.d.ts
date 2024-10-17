import type { App } from "../constructs/App.js";
interface SynthOptions {
    buildDir?: string;
    outDir?: string;
    increaseTimeout?: boolean;
    scriptVersion?: string;
    mode: App["mode"];
    fn: (app: App) => Promise<void> | void;
    isActiveStack?: (stackName: string) => boolean;
}
export declare function synth(opts: SynthOptions): Promise<import("aws-cdk-lib/cx-api").CloudAssembly>;
export {};
