declare let last: "line" | "gap";
export declare const Colors: {
    line: (message?: any, ...optionalParams: any[]) => void;
    mode(input: typeof last): void;
    gap(): void;
    hex: (color: string) => import("chalk").ChalkInstance;
    primary: import("chalk").ChalkInstance;
    link: import("chalk").ChalkInstance;
    success: import("chalk").ChalkInstance;
    danger: import("chalk").ChalkInstance;
    warning: import("chalk").ChalkInstance;
    dim: import("chalk").ChalkInstance;
    bold: import("chalk").ChalkInstance;
    all: import("chalk").ChalkInstance;
    prefix: string;
};
export {};
