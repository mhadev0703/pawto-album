import { createSigner, createVerifier } from "fast-jwt";
import { Context } from "../../context/context2.js";
import { useCookie, useHeader } from "../api/index.js";
import { getPrivateKey, getPublicKey } from "./auth.js";
import { useContextType } from "../../context/handler.js";
const SessionMemo = /* @__PURE__ */ Context.memo(() => {
    // Get the context type and hooks that match that type
    let token = "";
    const header = useHeader("authorization");
    if (header)
        token = header.substring(7);
    const ctxType = useContextType();
    const cookie = ctxType === "api" ? useCookie("auth-token") : undefined;
    if (cookie)
        token = cookie;
    // WebSocket may also set the token in the protocol header
    // TODO: Once https://github.com/sst/sst/pull/2838 is merged,
    // then we should no longer need to check both casing for the header.
    const wsProtocol = ctxType === "ws"
        ? useHeader("sec-websocket-protocol") ||
            useHeader("Sec-WebSocket-Protocol")
        : undefined;
    if (wsProtocol)
        token = wsProtocol.split(",")[0].trim();
    if (token) {
        const jwt = createVerifier({
            algorithms: ["RS512"],
            key: getPublicKey(),
        })(token);
        return jwt;
    }
    return {
        type: "public",
        properties: {},
    };
});
// This is a crazy TS hack to prevent the types from being evaluated too soon
export function useSession() {
    const ctx = SessionMemo();
    return ctx;
}
/**
 * Creates a new session token with provided information
 *
 * @example
 * ```js
 * Session.create({
 *   type: "user",
 *   properties: {
 *     userID: "123"
 *   }
 * })
 * ```
 */
function create(input) {
    const signer = createSigner({
        ...input.options,
        key: getPrivateKey(),
        algorithm: "RS512",
    });
    const token = signer({
        type: input.type,
        properties: input.properties,
    });
    return token;
}
/**
 * Returns a 302 redirect with an auth-token cookie set with the provided session information
 *
 * @example
 * ```js
 * Session.cookie({
 *   type: "user",
 *   properties: {
 *     userID: "123"
 *   },
 *   redirect: "https://app.example.com/"
 * })
 * ```
 */
export function cookie(input) {
    const token = create(input);
    const expires = new Date(Date.now() + (input.options?.expiresIn || 1000 * 60 * 60 * 24 * 7));
    return {
        statusCode: 302,
        headers: {
            location: input.redirect,
        },
        cookies: [
            `auth-token=${token}; HttpOnly; SameSite=None; Secure; Path=/; Expires=${expires}`,
        ],
    };
}
/**
 * Returns a 302 redirect with a query parameter named token set with the jwt value
 *
 * @example
 * ```js
 * Session.parameter({
 *   type: "user",
 *   properties: {
 *     userID: "123"
 *   },
 *   redirect: "https://app.example.com/"
 * })
 * ```
 */
export function parameter(input) {
    const token = create(input);
    return {
        statusCode: 302,
        headers: {
            location: input.redirect + "?token=" + token,
        },
    };
}
export const Session = {
    create,
    cookie,
    parameter,
};
