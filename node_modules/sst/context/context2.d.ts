export declare class ContextNotFoundError extends Error {
    name: string;
    constructor(name: string);
}
export type Context<T> = ReturnType<typeof create<T>>;
export declare function create<T>(name: string): {
    name: string;
    with<R>(value: T, cb: () => R): R;
    use(): T;
    version(): string;
};
export declare function memo<T>(cb: () => T): () => T;
export declare const Context: {
    create: typeof create;
    memo: typeof memo;
};
