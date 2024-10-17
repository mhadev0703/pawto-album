import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import { toCdkDuration } from "./duration.js";
export function buildCorsConfig(cors) {
    // Handle cors: false
    if (cors === false) {
        return;
    }
    // Handle cors: true | undefined
    if (cors === undefined || cors === true) {
        cors = {};
    }
    // Handle cors: CorsProps
    return {
        allowCredentials: cors.allowCredentials,
        allowedHeaders: cors.allowHeaders || ["*"],
        allowedMethods: (cors.allowMethods || ["*"]).map((method) => method === "*"
            ? HttpMethod.ALL
            : HttpMethod[method]),
        allowedOrigins: cors.allowOrigins || ["*"],
        exposedHeaders: cors.exposeHeaders,
        maxAge: cors.maxAge && toCdkDuration(cors.maxAge),
    };
}
