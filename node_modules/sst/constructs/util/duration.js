import { Duration as CDKDuration } from "aws-cdk-lib/core";
export function toCdkDuration(duration) {
    const [count, unit] = duration.split(" ");
    const countNum = parseInt(count);
    const unitLower = unit.toLowerCase();
    if (unitLower.startsWith("second")) {
        return CDKDuration.seconds(countNum);
    }
    else if (unitLower.startsWith("minute")) {
        return CDKDuration.minutes(countNum);
    }
    else if (unitLower.startsWith("hour")) {
        return CDKDuration.hours(countNum);
    }
    else if (unitLower.startsWith("day")) {
        return CDKDuration.days(countNum);
    }
    return CDKDuration.days(0);
}
