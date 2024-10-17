import esbuild from "esbuild";
declare module "../bus.js" {
    interface Events {
        "stack.built": {
            metafile: esbuild.Metafile;
        };
    }
}
export declare function load(input: string, shallow?: boolean): Promise<readonly [esbuild.Metafile, any]>;
