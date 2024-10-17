import { OauthBasicConfig } from "./oauth.js";
import { OidcBasicConfig } from "./oidc.js";
type Config = ({
    mode: "oauth";
} & OauthBasicConfig) | ({
    mode: "oidc";
} & OidcBasicConfig);
export declare const GithubAdapter: (config: Config) => (() => Promise<{
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
