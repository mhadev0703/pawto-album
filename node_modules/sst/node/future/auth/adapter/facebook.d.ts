import { OauthBasicConfig } from "./oauth.js";
export declare const FacebookAdapter: (config: OauthBasicConfig) => () => Promise<{
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
} | undefined>;
