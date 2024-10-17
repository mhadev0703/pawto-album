import { FunctionProps } from "../constructs/Function.js";
declare module "../bus.js" {
    interface Events {
        "function.build.started": {
            functionID: string;
        };
        "function.build.success": {
            functionID: string;
        };
        "function.build.failed": {
            functionID: string;
            errors: string[];
        };
    }
}
interface BuildInput {
    functionID: string;
    mode: "deploy" | "start";
    out: string;
    props: FunctionProps;
}
export interface StartWorkerInput {
    url: string;
    workerID: string;
    functionID: string;
    environment: Record<string, string>;
    out: string;
    handler: string;
    runtime: string;
}
interface ShouldBuildInput {
    file: string;
    functionID: string;
}
export interface RuntimeHandler {
    startWorker: (worker: StartWorkerInput) => Promise<void>;
    stopWorker: (workerID: string) => Promise<void>;
    shouldBuild: (input: ShouldBuildInput) => boolean;
    canHandle: (runtime: string) => boolean;
    build: (input: BuildInput) => Promise<{
        type: "success";
        handler: string;
        sourcemap?: string;
    } | {
        type: "error";
        errors: string[];
    }>;
}
export declare const useRuntimeHandlers: () => {
    subscribe: <Type extends "function.build.success" | "function.build.failed">(type: Type, cb: (payload: import("../bus.js").EventPayload<Type>) => void) => {
        type: keyof import("../bus.js").Events;
        cb: (payload: any) => void;
    };
    register: (handler: RuntimeHandler) => void;
    for: (runtime: string) => RuntimeHandler;
    build(functionID: string, mode: BuildInput["mode"]): Promise<{
        type: "error";
        errors: string[];
    } | {
        out: string;
        sourcemap: string | undefined;
        type: "success";
        handler: string;
    }>;
};
interface Artifact {
    out: string;
    handler: string;
}
export declare const useFunctionBuilder: () => {
    artifact: (functionID: string) => Artifact | Promise<Artifact | undefined>;
    build: (functionID: string) => Promise<Artifact | undefined>;
};
export {};
