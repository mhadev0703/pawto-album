/// <reference types="yargs" />
import type { Program } from "../../program.js";
export declare const get: (program: Program) => import("yargs").Argv<{
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
    name: string;
} & {
    fallback: boolean | undefined;
}>;
