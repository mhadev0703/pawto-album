import ora from "ora";
import { Colors } from "./colors.js";
import { lazy } from "../util/lazy.js";
export const useSpinners = lazy(() => {
    const spinners = [];
    return spinners;
});
export function createSpinner(options) {
    const spinners = useSpinners();
    const next = ora(options);
    spinners.push(next);
    Colors.mode("line");
    return next;
}
