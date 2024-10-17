import { HttpIntegrationSubtype, HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig, HttpRouteIntegration, ParameterMapping, IntegrationCredentials } from "@aws-cdk/aws-apigatewayv2-alpha";
/**
 * Properties to initialize a new `HttpProxyIntegration`.
 */
export interface HttpAwsIntegrationProps {
    /**
     * Specifies the AWS service action to invoke
     */
    readonly subtype: HttpIntegrationSubtype;
    /**
     * Specifies how to transform HTTP requests before sending them to the backend
     */
    readonly parameterMapping: ParameterMapping;
    /**
     * The credentials with which to invoke the integration.
     *
     * @default - no credentials, use resource-based permissions on supported AWS services
     */
    readonly credentials: IntegrationCredentials;
}
/**
 * The HTTP Proxy integration resource for HTTP API
 */
export declare class HttpAwsIntegration extends HttpRouteIntegration {
    private readonly props;
    /**
     * @param id id of the underlying integration construct
     * @param props properties to configure the integration
     */
    constructor(id: string, props: HttpAwsIntegrationProps);
    bind(_: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig;
}
