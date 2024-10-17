import { createYoga } from "graphql-yoga";
import { Handler, useEvent, useLambdaContext } from "../../context/handler.js";
export function GraphQLHandler(options) {
    const yoga = createYoga({
        graphqlEndpoint: process.env.GRAPHQL_ENDPOINT,
        ...options,
    });
    return Handler("api", async () => {
        const event = useEvent("api");
        const parameters = new URLSearchParams(event.queryStringParameters || {}).toString();
        const url = `${event.rawPath}?${parameters}`;
        const request = {
            method: event.requestContext.http.method,
            headers: event.headers,
            body: event.body
                ? Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8")
                : undefined,
        };
        const serverContext = {
            event,
            context: useLambdaContext(),
        };
        const response = await yoga.fetch(url, request, serverContext);
        const responseHeaders = Object.fromEntries(response.headers.entries());
        return {
            statusCode: response.status,
            headers: responseHeaders,
            body: await response.text(),
            isBase64Encoded: false,
        };
    });
}
