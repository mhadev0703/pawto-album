import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
export declare function LinkAdapter(config: {
    onLink: (link: string, claims: Record<string, any>) => Promise<APIGatewayProxyStructuredResultV2>;
}): () => Promise<{
    type: "step";
    properties: APIGatewayProxyStructuredResultV2;
} | {
    type: "success";
    properties: any;
} | undefined>;
