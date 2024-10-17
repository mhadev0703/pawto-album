import { Size as CDKSize } from "aws-cdk-lib/core";
export type Size = `${number} ${"MB" | "GB"}`;
export declare function toCdkSize(size: Size): CDKSize;
