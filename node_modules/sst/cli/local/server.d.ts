import { FunctionState, State } from "./router.js";
import { WritableDraft } from "immer/dist/internal.js";
import { DendriformPatch } from "dendriform-immer-patch-optimiser";
type Opts = {
    key: any;
    cert: any;
    live: boolean;
};
declare module "../../bus.js" {
    interface Events {
        "local.patches": DendriformPatch[];
    }
}
export declare const useLocalServerConfig: () => Promise<{
    port: number;
    url: string;
}>;
export declare function useLocalServer(opts: Opts): Promise<{
    updateState: (cb: (draft: WritableDraft<State>) => void) => void;
    updateFunction: (id: string, cb: (draft: WritableDraft<FunctionState>) => void) => void;
}>;
export {};
