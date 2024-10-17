/// <reference types="yargs" />
export declare const program: import("yargs").Argv<{
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
}>;
export type Program = typeof program;
export declare function exitWithError(error: Error): Promise<void>;
export declare function exit(code?: number): Promise<void>;
export declare function trackDevError(error: Error): Promise<void>;
export declare function trackDevRunning(): Promise<void>;
