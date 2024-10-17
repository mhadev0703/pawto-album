export * as Pothos from "./pothos.js";
interface GenerateOpts {
    schema: string;
    internalPackages?: string[];
}
export declare function generate(opts: GenerateOpts): Promise<string>;
export declare function extractSchema(opts: GenerateOpts): Promise<any>;
