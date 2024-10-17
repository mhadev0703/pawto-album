export declare const useCache: () => Promise<{
    write: (key: string, data: string) => Promise<void>;
    read: (key: string) => Promise<string | null>;
}>;
