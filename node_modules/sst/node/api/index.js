import { createProxy } from "../util/index.js";
import { useEvent, Handler, useContextType, } from "../../context/handler.js";
import { memo } from "../../context/context2.js";
export const Api = /* @__PURE__ */ createProxy("Api");
export const AppSyncApi = 
/* @__PURE__ */ createProxy("AppSyncApi");
export const ApiGatewayV1Api = 
/* @__PURE__ */ createProxy("ApiGatewayV1Api");
export class Response {
    result;
    constructor(result) {
        this.result = result;
    }
}
/**
 * Create a new api handler that can be used to create an authenticated session.
 *
 * @example
 * ```ts
 * export const handler = ApiHandler({
 * })
 * ```
 */
export function ApiHandler(cb) {
    return Handler("api", async (evt, ctx) => {
        let result;
        try {
            result = await cb(evt, ctx);
        }
        catch (e) {
            if (e instanceof Response) {
                result = e.result;
            }
            else
                throw e;
        }
        const serialized = useResponse().serialize(result || {});
        return serialized;
    });
}
export const useCookies = /* @__PURE__ */ memo(() => {
    const evt = useEvent("api");
    const cookies = evt.cookies || [];
    return Object.fromEntries(cookies.map((c) => c.split("=")).map(([k, v]) => [k, decodeURIComponent(v)]));
});
export function useCookie(name) {
    const cookies = useCookies();
    return cookies[name];
}
export const useBody = /* @__PURE__ */ memo(() => {
    const type = useContextType();
    const evt = useEvent(type);
    if (!evt.body)
        return;
    const body = evt.isBase64Encoded
        ? Buffer.from(evt.body, "base64").toString()
        : evt.body;
    return body;
});
export const useJsonBody = /* @__PURE__ */ memo(() => {
    const body = useBody();
    if (!body)
        return;
    return JSON.parse(body);
});
export const useFormData = /* @__PURE__ */ memo(() => {
    const body = useBody();
    if (!body)
        return;
    const params = new URLSearchParams(body);
    return params;
});
export const usePath = /* @__PURE__ */ memo(() => {
    const evt = useEvent("api");
    return evt.rawPath.split("/").filter(Boolean);
});
export const useResponse = /* @__PURE__ */ memo(() => {
    useEvent("api");
    const response = {
        headers: {},
        cookies: [],
    };
    const result = {
        cookies(values, options) {
            for (const [key, value] of Object.entries(values)) {
                result.cookie({
                    key,
                    value,
                    ...options,
                });
            }
            return result;
        },
        cookie(input) {
            input = {
                secure: true,
                sameSite: "None",
                httpOnly: true,
                ...input,
            };
            const value = encodeURIComponent(input.value);
            const parts = [input.key + "=" + value];
            if (input.domain)
                parts.push("Domain=" + input.domain);
            if (input.path)
                parts.push("Path=" + input.path);
            if (input.expires)
                parts.push("Expires=" + input.expires.toUTCString());
            if (input.maxAge)
                parts.push("Max-Age=" + input.maxAge);
            if (input.httpOnly)
                parts.push("HttpOnly");
            if (input.secure)
                parts.push("Secure");
            if (input.sameSite)
                parts.push("SameSite=" + input.sameSite);
            response.cookies.push(parts.join("; "));
            return result;
        },
        status(code) {
            response.statusCode = code;
            return result;
        },
        header(key, value) {
            response.headers[key] = value;
            return result;
        },
        serialize(input) {
            return {
                ...response,
                ...input,
                cookies: [...(input.cookies || []), ...response.cookies],
                headers: {
                    ...response.headers,
                    ...input.headers,
                },
            };
        },
    };
    return result;
});
export function useDomainName() {
    const type = useContextType();
    const evt = useEvent(type);
    return evt.requestContext.domainName;
}
export function useMethod() {
    const evt = useEvent("api");
    return evt.requestContext.http.method;
}
export function useHeaders() {
    const type = useContextType();
    const evt = useEvent(type);
    return evt.headers || {};
}
export function useHeader(key) {
    const headers = useHeaders();
    return headers[key];
}
export function useFormValue(name) {
    const params = useFormData();
    return params?.get(name);
}
export function useQueryParams() {
    const type = useContextType();
    const evt = useEvent(type);
    const query = evt.queryStringParameters || {};
    return query;
}
export function useQueryParam(name) {
    return useQueryParams()[name];
}
export function usePathParams() {
    const evt = useEvent("api");
    const path = evt.pathParameters || {};
    return path;
}
export function usePathParam(name) {
    return usePathParams()[name];
}
