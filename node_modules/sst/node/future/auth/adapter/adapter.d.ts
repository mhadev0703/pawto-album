import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
export type Adapter<T = any> = (evt: APIGatewayProxyEventV2) => Promise<{
    type: "step";
    properties: APIGatewayProxyStructuredResultV2;
} | {
    type: "success";
    properties: T;
} | {
    type: "error";
    error: AdapterError;
} | undefined>;
export declare class AdapterError extends Error {
}
export declare class AdapterUnknownError extends AdapterError {
}
