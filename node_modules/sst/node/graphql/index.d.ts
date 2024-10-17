import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { YogaServerOptions } from "graphql-yoga";
type ServerContext = {
    event: APIGatewayProxyEventV2;
    context: Context;
};
export declare function GraphQLHandler<UserContext extends {}>(options: YogaServerOptions<ServerContext, UserContext>): (event: APIGatewayProxyEventV2, context: Context) => Promise<{
    statusCode: number;
    headers: {
        [k: string]: string;
    };
    body: string;
    isBase64Encoded: boolean;
}>;
export {};
