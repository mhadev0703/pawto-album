/// <reference types="yargs" />
import type { Program } from "../program.js";
export declare const consoleCommand: (program: Program) => Promise<import("yargs").Argv<{
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
}>>;
