export declare const Context: {
    create: typeof create;
    reset: typeof reset;
    memo: typeof memo;
};
declare function create<C>(cb?: (() => C) | string, name?: string): {
    use(): C;
    reset(): void;
    provide(value: C): void;
};
declare function reset(): void;
export declare function memo<C>(cb: () => C, name?: string): () => C;
export {};
