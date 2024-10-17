declare const WARNINGS: {
    "config.deprecated": string;
    "permissions.noConstructs": string;
    "go.deprecated": string;
    "remix.cjs": string;
};
export declare const useWarning: () => {
    add(message: keyof typeof WARNINGS): void;
    print(): void;
};
export {};
