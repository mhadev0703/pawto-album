import { OidcBasicConfig } from "./oidc.js";
import { OauthBasicConfig } from "./oauth.js";
type GooglePrompt = "none" | "consent" | "select_account";
type GoogleAccessType = "offline" | "online";
type GoogleConfig = (OauthBasicConfig & {
    mode: "oauth";
    prompt?: GooglePrompt;
    accessType?: GoogleAccessType;
}) | (OidcBasicConfig & {
    mode: "oidc";
    prompt?: GooglePrompt;
});
export declare function GoogleAdapter(config: GoogleConfig): (() => Promise<{
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
}>) | (() => Promise<{
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
    error?: undefined;
} | {
    type: "error";
    error: import("./oauth.js").OauthError;
    properties?: undefined;
} | undefined>);
export {};
