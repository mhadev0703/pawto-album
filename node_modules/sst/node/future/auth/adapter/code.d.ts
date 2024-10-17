import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
export declare function CodeAdapter(config: {
    length?: number;
    onCodeRequest: (code: string, claims: Record<string, any>) => Promise<APIGatewayProxyStructuredResultV2>;
    onCodeInvalid: (code: string, claims: Record<string, any>) => Promise<APIGatewayProxyStructuredResultV2>;
}): () => Promise<{
    type: "step";
    properties: APIGatewayProxyStructuredResultV2;
} | {
    type: "success";
    properties: {
        claims: any;
    };
} | undefined>;
