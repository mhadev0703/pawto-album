import { createSigner, createVerifier } from "fast-jwt";
import { Context } from "../../../context/context2.js";
import { useCookie, useHeader } from "../../api/index.js";
import { Auth } from "../../auth/index.js";
import { Config } from "../../config/index.js";
import { useContextType } from "../../../context/handler.js";
const SessionMemo = /* @__PURE__ */ Context.memo(() => {
    // Get the context type and hooks that match that type
    let token = "";
    // Websockets don't lowercase headers
    const header = useHeader("authorization") || useHeader("Authorization");
    if (header)
        token = header.substring(7);
    const ctxType = useContextType();
    const cookie = ctxType === "api" ? useCookie("sst_auth_token") : undefined;
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
        return Session.verify(token);
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
function getPublicKey() {
    // This is the auth function accessing the public key
    if (process.env.AUTH_ID) {
        // @ts-expect-error
        const key = Config[process.env.AUTH_ID + "PublicKey"];
        if (key)
            return key;
    }
    const [first] = Object.values(Auth);
    if (!first)
        throw new Error("No auth provider found. Did you forget to add one?");
    return first.publicKey;
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
    // @ts-expect-error
    const key = Config[process.env.AUTH_ID + "PrivateKey"];
    const signer = createSigner({
        ...input.options,
        key,
        algorithm: "RS512",
    });
    const token = signer({
        type: input.type,
        properties: input.properties,
    });
    return token;
}
/**
 * Verifies a session token and returns the session data
 *
 * @example
 * ```js
 * Session.verify()
 * ```
 */
function verify(token) {
    if (token) {
        try {
            const jwt = createVerifier({
                algorithms: ["RS512"],
                key: getPublicKey(),
            })(token);
            return jwt;
        }
        catch (e) { }
    }
    return {
        type: "public",
        properties: {},
    };
}
export const Session = {
    create,
    verify,
};
export function createSessionBuilder() {
    return {
        create(type, properties, options) {
            // @ts-expect-error
            const key = Config[process.env.AUTH_ID + "PrivateKey"];
            const signer = createSigner({
                ...options,
                key,
                algorithm: "RS512",
            });
            const token = signer({
                type: type,
                properties: properties,
            });
            return token;
        },
        verify(token) {
            if (token) {
                try {
                    const jwt = createVerifier({
                        algorithms: ["RS512"],
                        key: getPublicKey(),
                    })(token);
                    return jwt;
                }
                catch (e) { }
            }
            return {
                type: "public",
                properties: {},
            };
        },
        use() {
            const ctx = SessionMemo();
            return ctx;
        },
        $type: {},
        $typeValues: {},
    };
}
