interface Metadata {
    mode: "deploy" | "dev";
}
export declare function saveAppMetadata(data: Metadata): Promise<void>;
export declare function clearAppMetadata(): Promise<void>;
export declare const useAppMetadata: () => Promise<Metadata | undefined>;
export {};
