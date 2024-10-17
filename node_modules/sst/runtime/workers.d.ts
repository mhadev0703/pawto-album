declare module "../bus.js" {
    interface Events {
        "worker.started": {
            workerID: string;
            functionID: string;
        };
        "worker.stopped": {
            workerID: string;
            functionID: string;
        };
        "worker.exited": {
            workerID: string;
            functionID: string;
        };
        "worker.stdout": {
            workerID: string;
            functionID: string;
            requestID: string;
            message: string;
        };
    }
}
interface Worker {
    workerID: string;
    functionID: string;
}
export declare const useRuntimeWorkers: () => Promise<{
    fromID(workerID: string): Worker;
    getCurrentRequestID(workerID: string): string | undefined;
    stdout(workerID: string, message: string): void;
    exited(workerID: string): void;
    subscribe: <Type extends "worker.started" | "worker.stopped" | "worker.exited" | "worker.stdout">(type: Type, cb: (payload: import("../bus.js").EventPayload<Type>) => void) => {
        type: keyof import("../bus.js").Events;
        cb: (payload: any) => void;
    };
}>;
export {};
