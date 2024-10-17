export const consoleCommand = async (program) => program.command("console", "Start the SST Console", (yargs) => yargs, async () => {
    const { exit, exitWithError } = await import("../program.js");
    const { useRuntimeServer } = await import("../../runtime/server.js");
    const { useLocalServer } = await import("../local/server.js");
    const { printHeader } = await import("../ui/header.js");
    const { clear } = await import("../terminal.js");
    try {
        await Promise.all([
            useRuntimeServer(),
            useLocalServer({
                key: "",
                cert: "",
                live: false,
            }),
        ]);
        clear();
        printHeader({ console: true, hint: "ready!" });
    }
    catch (e) {
        await exitWithError(e);
    }
});
