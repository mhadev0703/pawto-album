import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { Adapter } from "./adapter/adapter.js";
import { SignerOptions } from "fast-jwt";
import { SessionBuilder } from "./session.js";
interface OnSuccessResponder<T extends {
    type: any;
    properties: any;
}> {
    session(input: T & Partial<SignerOptions>): {
        type: "session";
        properties: T;
    };
    http(input: APIGatewayProxyStructuredResultV2): {
        type: "http";
        properties: typeof input;
    };
}
export declare class UnknownProviderError extends Error {
    provider?: string | undefined;
    constructor(provider?: string | undefined);
}
export declare class MissingParameterError extends Error {
    parameter: string;
    constructor(parameter: string);
}
export declare class UnknownStateError extends Error {
    constructor();
}
export declare class UnauthorizedClientError extends Error {
    client: string;
    redirect_uri: string;
    constructor(client: string, redirect_uri: string);
}
export declare class InvalidSessionError extends Error {
    constructor();
}
export declare function AuthHandler<Providers extends Record<string, Adapter<any>>, Sessions extends SessionBuilder, Result = {
    [key in keyof Providers]: {
        provider: key;
    } & Extract<Awaited<ReturnType<Providers[key]>>, {
        type: "success";
    }>["properties"];
}[keyof Providers]>(input: {
    providers: Providers;
    sessions?: Sessions;
    /** @deprecated use callbacks.auth.allowClient callback instead */
    clients?: () => Promise<Record<string, string>>;
    /** @deprecated use callbacks.auth.allowClient callback instead */
    allowClient?: (clientID: string, redirect: string) => Promise<boolean>;
    /** @deprecated use callbacks.auth.start callback instead */
    onAuthorize?: (event: APIGatewayProxyEventV2) => Promise<void | keyof Providers>;
    /** @deprecated use callbacks.auth.success callback instead */
    onSuccess?: (input: Result, response: OnSuccessResponder<Sessions["$typeValues"]>) => Promise<ReturnType<OnSuccessResponder<Sessions["$typeValues"]>[keyof OnSuccessResponder<any>]>>;
    /** @deprecated */
    onIndex?: (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyStructuredResultV2>;
    /** @deprecated use on.error callback instead */
    onError?: (error: MissingParameterError | UnauthorizedClientError | UnknownProviderError) => Promise<APIGatewayProxyStructuredResultV2 | undefined>;
    callbacks: {
        index?(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2>;
        error?(error: UnknownStateError): Promise<APIGatewayProxyStructuredResultV2 | undefined>;
        auth: {
            error?(error: MissingParameterError | UnauthorizedClientError | UnknownProviderError): Promise<APIGatewayProxyStructuredResultV2 | undefined>;
            start?(event: APIGatewayProxyEventV2): Promise<void>;
            allowClient(clientID: string, redirect: string): Promise<boolean>;
            success(input: Result, response: OnSuccessResponder<Sessions["$typeValues"]>): Promise<ReturnType<OnSuccessResponder<Sessions["$typeValues"]>[keyof OnSuccessResponder<any>]>>;
        };
        connect?: {
            error?(error: InvalidSessionError | UnknownProviderError): Promise<APIGatewayProxyStructuredResultV2 | undefined>;
            start?(session: Sessions["$typeValues"], event: APIGatewayProxyEventV2): Promise<void>;
            success?(session: Sessions["$typeValues"], input: Result): Promise<APIGatewayProxyStructuredResultV2>;
        };
    };
}): (event: APIGatewayProxyEventV2, context: import("aws-lambda").Context) => Promise<APIGatewayProxyStructuredResultV2>;
export {};
