export declare const useRuntimeServerConfig: () => Promise<{
    API_VERSION: string;
    port: number;
    url: string;
}>;
export declare const useRuntimeServer: () => Promise<void>;
