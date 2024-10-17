export declare function createLoader<Key, Value>(batchFn: (keys: Key[]) => Promise<Value[]>): (key: Key) => Promise<Value>;
export declare function useLoader<Key, Value>(key: any, batchFn: (keys: Key[]) => Promise<Value[]>): (key: Key) => Promise<Value>;
