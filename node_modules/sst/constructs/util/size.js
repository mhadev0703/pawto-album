import { Size as CDKSize } from "aws-cdk-lib/core";
export function toCdkSize(size) {
    const [count, unit] = size.split(" ");
    const countNum = parseInt(count);
    if (unit === "MB") {
        return CDKSize.mebibytes(countNum);
    }
    else if (unit === "GB") {
        return CDKSize.gibibytes(countNum);
    }
    throw new Error(`Invalid size ${size}`);
}
