import { OauthBasicConfig } from "./oauth.js";
/**
 * The Spotify Adapter follows the PKCE flow outlined here:
 * https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 *
 * List of scopes available:
 * https://developer.spotify.com/documentation/web-api/concepts/scopes
 */
export declare const SpotifyAdapter: (config: OauthBasicConfig) => () => Promise<{
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
