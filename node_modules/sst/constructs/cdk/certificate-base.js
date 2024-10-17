import { Metric, Stats } from "aws-cdk-lib/aws-cloudwatch";
import { Duration, Resource } from "aws-cdk-lib/core";
/**
 * Shared implementation details of ICertificate implementations.
 *
 * @internal
 */
export class CertificateBase extends Resource {
    /**
     * If the certificate is provisionned in a different region than the
     * containing stack, this should be the region in which the certificate lives
     * so we can correctly create `Metric` instances.
     */
    region;
    metricDaysToExpiry(props) {
        return new Metric({
            period: Duration.days(1),
            ...props,
            dimensionsMap: { CertificateArn: this.certificateArn },
            metricName: "DaysToExpiry",
            namespace: "AWS/CertificateManager",
            region: this.region,
            statistic: Stats.MINIMUM,
        });
    }
}
