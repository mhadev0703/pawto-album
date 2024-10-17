import type { Metadata } from "../constructs/Metadata.js";
declare module "../bus.js" {
    interface Events {
        "stacks.metadata": Awaited<ReturnType<typeof metadata>>;
        "stacks.metadata.updated": {};
        "stacks.metadata.deleted": {};
    }
}
export declare function metadataForStack(stack: String): Promise<Metadata[] | undefined>;
export declare function metadata(): Promise<Record<string, Metadata[]>>;
export declare const useMetadataCache: () => Promise<Record<string, Metadata[]>>;
