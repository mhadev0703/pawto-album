import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
export declare function createAdapter<A extends (config: any) => Adapter>(adapter: A): A;
export type Adapter = () => Promise<APIGatewayProxyStructuredResultV2>;
