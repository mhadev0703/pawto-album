/// <reference types="yargs" />
import type { Program } from "../../program.js";
export declare const list: (program: Program) => import("yargs").Argv<{
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
    format: string | undefined;
} & {
    fallback: boolean | undefined;
}>;
