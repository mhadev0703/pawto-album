import { Duration as CDKDuration } from "aws-cdk-lib/core";
export type Duration = `${number} ${"second" | "seconds" | "minute" | "minutes" | "hour" | "hours" | "day" | "days"}`;
export declare function toCdkDuration(duration: Duration): CDKDuration;
