import { OidcBasicConfig } from "./oidc.js";
type MicrosoftConfig = OidcBasicConfig & {
    mode: "oidc";
    prompt?: "login" | "none" | "consent" | "select_account";
    tenantID?: string;
};
export declare function MicrosoftAdapter(config: MicrosoftConfig): () => Promise<{
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
export {};
