import { Metric, MetricOptions } from "aws-cdk-lib/aws-cloudwatch";
import { Resource } from "aws-cdk-lib/core";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
/**
 * Shared implementation details of ICertificate implementations.
 *
 * @internal
 */
export declare abstract class CertificateBase extends Resource implements ICertificate {
    abstract readonly certificateArn: string;
    /**
     * If the certificate is provisionned in a different region than the
     * containing stack, this should be the region in which the certificate lives
     * so we can correctly create `Metric` instances.
     */
    protected readonly region?: string;
    metricDaysToExpiry(props?: MetricOptions): Metric;
}
