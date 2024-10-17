import chalk from "chalk";
let last = "gap";
export const Colors = {
    line: (message, ...optionalParams) => {
        last = "line";
        console.log(message, ...optionalParams);
    },
    mode(input) {
        last = input;
    },
    gap() {
        if (last === "line") {
            last = "gap";
            console.log();
        }
    },
    hex: chalk.hex,
    primary: chalk.hex("#FF9000"),
    link: chalk.cyan,
    success: chalk.green,
    danger: chalk.red,
    warning: chalk.yellow,
    dim: chalk.dim,
    bold: chalk.bold,
    all: chalk,
    prefix: chalk.bold("| "),
};
