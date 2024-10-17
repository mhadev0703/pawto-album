/// <reference types="yargs" />
import type { Program } from "../program.js";
export declare const bind: (program: Program) => import("yargs").Argv<{
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
    script: boolean | undefined;
} & {
    command: (string | number)[] | undefined;
}>;
