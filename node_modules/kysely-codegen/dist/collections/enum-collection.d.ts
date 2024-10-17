export type EnumMap = {
    [K in string]?: string[];
};
export declare class EnumCollection {
    readonly enums: EnumMap;
    constructor(enums?: EnumMap);
    add(key: string, value: string): void;
    get(key: string): string[] | null;
    has(key: string): boolean;
    set(key: string, values: string[]): void;
}
