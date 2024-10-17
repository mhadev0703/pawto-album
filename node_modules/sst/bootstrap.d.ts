export declare const useBootstrap: () => Promise<{
    version: string;
    bucket: string;
}>;
export declare function bootstrapSST(cdkBucket: string): Promise<void>;
