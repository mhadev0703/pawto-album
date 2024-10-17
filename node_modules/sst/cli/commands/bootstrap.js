export const bootstrap = (program) => program.command("bootstrap", "Create the SST bootstrap stack", (yargs) => yargs, async () => {
    const { exit, exitWithError } = await import("../program.js");
    const { useBootstrap } = await import("../../bootstrap.js");
    try {
        await useBootstrap();
        await exit();
    }
    catch (e) {
        await exitWithError(e);
    }
});
