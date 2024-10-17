import { HttpIntegrationType, HttpRouteIntegration, PayloadFormatVersion, } from "@aws-cdk/aws-apigatewayv2-alpha";
/**
 * The HTTP Proxy integration resource for HTTP API
 */
export class HttpAwsIntegration extends HttpRouteIntegration {
    props;
    /**
     * @param id id of the underlying integration construct
     * @param props properties to configure the integration
     */
    constructor(id, props) {
        super(id);
        this.props = props;
    }
    bind(_) {
        return {
            payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
            type: HttpIntegrationType.AWS_PROXY,
            subtype: this.props.subtype,
            parameterMapping: this.props.parameterMapping,
            credentials: this.props.credentials,
        };
    }
}
