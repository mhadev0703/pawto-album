declare module "./bus.js" {
    interface Events {
        "file.changed": {
            file: string;
            relative: string;
        };
    }
}
export declare const useWatcher: () => {
    subscribe: <Type extends "file.changed">(type: Type, cb: (payload: import("./bus.js").EventPayload<Type>) => void) => {
        type: keyof import("./bus.js").Events;
        cb: (payload: any) => void;
    };
};
