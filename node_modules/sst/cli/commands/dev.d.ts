/// <reference types="yargs" />
import type { Program } from "../program.js";
export declare const dev: (program: Program) => import("yargs").Argv<{
    stage: string | undefined;
} & {
    profile: string | undefined;
} & {
    region: string | undefined;
} & {
    verbose: boolean | undefined;
} & {
    role: string | undefined;
} & {
    future: boolean | undefined;
} & {
    "increase-timeout": boolean | undefined;
}>;
declare module "../../bus.js" {
    interface Events {
        "cli.dev": {
            app: string;
            stage: string;
        };
    }
}
