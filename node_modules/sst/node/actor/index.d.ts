import { SSTError } from "../../util/error.js";
interface Definition {
    type: string;
    properties: Record<string, any>;
}
export declare class WrongActorError extends SSTError {
}
export declare function createActors<T extends Definition>(): {
    useActor: () => T | {
        type: "public";
        properties: {};
    };
    withActor: <R>(value: T | {
        type: "public";
        properties: {};
    }, cb: () => R) => R;
    assertActor<T_1 extends (T | {
        type: "public";
        properties: {};
    })["type"]>(type: T_1): (Extract<T, {
        type: T_1;
    }> | Extract<{
        type: "public";
        properties: {};
    }, {
        type: T_1;
    }>)["properties"];
};
export {};
