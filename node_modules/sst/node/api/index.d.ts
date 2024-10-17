import { Handler, HandlerTypes } from "../../context/handler.js";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
export interface ApiResources {
}
export interface AppSyncApiResources {
}
export interface ApiGatewayV1ApiResources {
}
export type ApiHandlerTypes = Extract<HandlerTypes, "api" | "ws">;
export declare const Api: ApiResources;
export declare const AppSyncApi: AppSyncApiResources;
export declare const ApiGatewayV1Api: ApiGatewayV1ApiResources;
export declare class Response {
    readonly result: APIGatewayProxyStructuredResultV2;
    constructor(result: APIGatewayProxyStructuredResultV2);
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
export declare function ApiHandler(cb: Parameters<typeof Handler<"api">>[1]): (event: import("aws-lambda").APIGatewayProxyEventV2, context: import("aws-lambda").Context) => Promise<APIGatewayProxyStructuredResultV2>;
export declare const useCookies: () => {
    [k: string]: string;
};
export declare function useCookie(name: string): string | undefined;
export declare const useBody: () => string | undefined;
export declare const useJsonBody: () => any;
export declare const useFormData: () => URLSearchParams | undefined;
export declare const usePath: () => string[];
interface CookieOptions {
    expires?: Date;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
}
export declare const useResponse: () => {
    cookies(values: Record<string, string>, options: CookieOptions): any;
    cookie(input: {
        key: string;
        value: string;
        encrypted?: string;
    } & CookieOptions): any;
    status(code: number): any;
    header(key: string, value: string): any;
    serialize(input: APIGatewayProxyStructuredResultV2): APIGatewayProxyStructuredResultV2;
};
export declare function useDomainName(): string;
export declare function useMethod(): string;
export declare function useHeaders(): import("aws-lambda").APIGatewayProxyEventHeaders;
export declare function useHeader(key: string): string | undefined;
export declare function useFormValue(name: string): string | null | undefined;
export declare function useQueryParams(): import("aws-lambda").APIGatewayProxyEventQueryStringParameters;
export declare function useQueryParam<T = string>(name: string): T | undefined;
export declare function usePathParams(): import("aws-lambda").APIGatewayProxyEventPathParameters;
export declare function usePathParam(name: string): string | undefined;
export {};
