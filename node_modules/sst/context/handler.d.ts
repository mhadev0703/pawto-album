import { APIGatewayProxyEventHeaders, APIGatewayProxyEventMultiValueHeaders, APIGatewayProxyEventMultiValueQueryStringParameters, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyStructuredResultV2, APIGatewayProxyWebsocketEventV2, Context as LambdaContext, SQSBatchResponse, SQSEvent } from "aws-lambda";
export interface Handlers {
    api: {
        event: APIGatewayProxyEventV2;
        response: APIGatewayProxyStructuredResultV2 | void;
    };
    ws: {
        event: APIGatewayProxyWebsocketEventV2 & {
            headers?: APIGatewayProxyEventHeaders;
            multiValueHeaders?: APIGatewayProxyEventMultiValueHeaders;
            queryStringParameters?: APIGatewayProxyEventQueryStringParameters | null;
            multiValueQueryStringParameters?: APIGatewayProxyEventMultiValueQueryStringParameters | null;
        };
        response: APIGatewayProxyResultV2;
    };
    sqs: {
        event: SQSEvent;
        response: SQSBatchResponse;
    };
}
export type HandlerTypes = keyof Handlers;
export declare function useContextType(): HandlerTypes;
export declare function useEvent<Type extends HandlerTypes>(type: Type): Handlers[Type]["event"];
export declare function useLambdaContext(): LambdaContext;
export declare function Handler<Type extends HandlerTypes, Event = Handlers[Type]["event"], Response = Handlers[Type]["response"]>(type: Type, cb: (evt: Event, ctx: LambdaContext) => Promise<Response>): (event: Event, context: LambdaContext) => Promise<Response>;
