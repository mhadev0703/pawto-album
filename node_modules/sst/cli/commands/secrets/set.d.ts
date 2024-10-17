/// <reference types="yargs" />
import type { Program } from "../../program.js";
export declare const set: (program: Program) => import("yargs").Argv<{
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
    value: string;
} & {
    fallback: boolean | undefined;
}>;
