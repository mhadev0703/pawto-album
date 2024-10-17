import * as trpc from "@trpc/server";
import { DendriformPatch } from "dendriform-immer-patch-optimiser";
import { useProject } from "../../project.js";
export type State = {
    app: string;
    stage: string;
    functions: Record<string, FunctionState>;
    bootstrap: ReturnType<typeof useProject>["config"]["bootstrap"];
    live: boolean;
    stacks: {
        status: any;
    };
};
export type FunctionState = {
    state: "idle" | "building" | "checking";
    invocations: Invocation[];
    issues: Record<string, any[]>;
    warm: boolean;
};
export type Invocation = {
    id: string;
    request: any;
    response?: any;
    times: {
        start: number;
        end?: number;
    };
    logs: {
        message: string;
        timestamp: number;
    }[];
};
export type Context = {
    state: State;
};
export declare const router: import("@trpc/server/dist/declarations/src/router.js").Router<Context, Context, Record<"getCredentials", import("@trpc/server/dist/declarations/src/internals/procedure.js").Procedure<Context, Context, undefined, undefined, {
    region: string | undefined;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
        sessionToken: string | undefined;
    };
}>> & Record<"getState", import("@trpc/server/dist/declarations/src/internals/procedure.js").Procedure<Context, Context, undefined, undefined, State>>, Record<"deploy", import("@trpc/server/dist/declarations/src/internals/procedure.js").Procedure<Context, Context, undefined, undefined, void>>, Record<"onStateChange", import("@trpc/server/dist/declarations/src/internals/procedure.js").Procedure<Context, Context, undefined, undefined, trpc.Subscription<DendriformPatch[]>>>, trpc.DefaultErrorShape>;
export type Router = typeof router;
