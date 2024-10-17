import { Handler } from "../../context/handler.js";
export interface WebSocketApiResources {
}
export declare const WebSocketApi: WebSocketApiResources;
/**
 * Create a new WebSocketApi handler that can be used to create an
 * authenticated session.
 *
 * @example
 * ```ts
 * export const handler = WebSocketApiHandler({
 * })
 * ```
 */
export declare function WebSocketApiHandler(cb: Parameters<typeof Handler<"ws">>[1]): (event: import("aws-lambda").APIGatewayProxyWebsocketEventV2 & {
    headers?: import("aws-lambda").APIGatewayProxyEventHeaders | undefined;
    multiValueHeaders?: import("aws-lambda").APIGatewayProxyEventMultiValueHeaders | undefined;
    queryStringParameters?: import("aws-lambda").APIGatewayProxyEventQueryStringParameters | null | undefined;
    multiValueQueryStringParameters?: import("aws-lambda").APIGatewayProxyEventMultiValueQueryStringParameters | null | undefined;
}, context: import("aws-lambda").Context) => Promise<any>;
export declare function useRequestContext(): import("aws-lambda").APIGatewayEventWebsocketRequestContextV2;
export declare function useConnectionId(): string;
export declare function useEventType(): "CONNECT" | "MESSAGE" | "DISCONNECT";
