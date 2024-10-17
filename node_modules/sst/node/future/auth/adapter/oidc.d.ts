import { Issuer } from "openid-client";
export interface OidcBasicConfig {
    /**
     * The clientID provided by the third party oauth service
     */
    clientID: string;
    /**
     * Determines whether users will be prompted for reauthentication and consent
     */
    prompt?: string;
}
export interface OidcConfig extends OidcBasicConfig {
    issuer: Issuer;
    scope: string;
}
export declare const OidcAdapter: (config: OidcConfig) => () => Promise<{
    type: "success";
    properties: {
        tokenset: import("openid-client").TokenSet;
        client: import("openid-client").BaseClient;
    };
} | {
    type: "step";
    properties: {
        statusCode: number;
        headers: {
            location: string;
        };
    };
}>;
