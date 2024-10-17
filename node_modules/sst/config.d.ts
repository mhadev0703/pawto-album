import { FunctionMetadata, NextjsSiteMetadata, AstroSiteMetadata, RemixSiteMetadata, SolidStartSiteMetadata, SvelteKitSiteMetadata, SSRSiteMetadata } from "./constructs/Metadata.js";
declare module "./bus.js" {
    interface Events {
        "config.secret.updated": {
            name: string;
        };
    }
}
interface Secret {
    value?: string;
    fallback?: string;
}
export declare namespace Config {
    function parameters(): Promise<({
        type: string;
        id: string;
        prop: string;
    } & {
        value: string;
    })[]>;
    function envFor(input: {
        type: string;
        id: string;
        prop: string;
        fallback?: boolean;
    }): string;
    function pathFor(input: {
        type: string;
        id: string;
        prop: string;
        fallback?: boolean;
    }): string;
    function normalizeID(input: string): string;
    function secrets(): Promise<Record<string, Secret>>;
    function env(): Promise<any>;
    function setSecret(input: {
        key: string;
        value: string;
        fallback?: boolean;
    }): Promise<void>;
    function getSecret(input: {
        key: string;
        fallback?: boolean;
    }): Promise<string | undefined>;
    function removeSecret(input: {
        key: string;
        fallback?: boolean;
    }): Promise<void>;
    function restart(keys: string[]): Promise<{
        edgeSites: (NextjsSiteMetadata | AstroSiteMetadata | RemixSiteMetadata | SolidStartSiteMetadata | SvelteKitSiteMetadata)[];
        sites: SSRSiteMetadata[];
        placeholderSites: (NextjsSiteMetadata | AstroSiteMetadata | RemixSiteMetadata | SolidStartSiteMetadata | SvelteKitSiteMetadata)[];
        functions: FunctionMetadata[];
    }>;
}
export {};
