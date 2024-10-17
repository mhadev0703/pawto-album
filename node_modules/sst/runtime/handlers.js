import { Logger } from "../logger.js";
import path from "path";
import fs from "fs/promises";
import { useWatcher } from "../watcher.js";
import { useBus } from "../bus.js";
import { useProject } from "../project.js";
import { useFunctions } from "../constructs/Function.js";
import { useNodeHandler } from "./handlers/node.js";
import { useContainerHandler } from "./handlers/container.js";
import { useDotnetHandler } from "./handlers/dotnet.js";
import { useGoHandler } from "./handlers/go.js";
import { useJavaHandler } from "./handlers/java.js";
import { usePythonHandler } from "./handlers/python.js";
import { useRustHandler } from "./handlers/rust.js";
import { lazy } from "../util/lazy.js";
import { Semaphore } from "../util/semaphore.js";
export const useRuntimeHandlers = lazy(() => {
    const handlers = [
        useNodeHandler(),
        useGoHandler(),
        useContainerHandler(),
        usePythonHandler(),
        useJavaHandler(),
        useDotnetHandler(),
        useRustHandler(),
    ];
    const project = useProject();
    const bus = useBus();
    const pendingBuilds = new Map();
    const result = {
        subscribe: bus.forward("function.build.success", "function.build.failed"),
        register: (handler) => {
            handlers.push(handler);
        },
        for: (runtime) => {
            const result = handlers.find((x) => x.canHandle(runtime));
            if (!result)
                throw new Error(`${runtime} runtime is unsupported`);
            return result;
        },
        async build(functionID, mode) {
            async function task() {
                const func = useFunctions().fromID(functionID);
                if (!func)
                    return {
                        type: "error",
                        errors: [`Function with ID "${functionID}" not found`],
                    };
                const handler = result.for(func.runtime);
                const out = path.join(project.paths.artifacts, functionID);
                await fs.rm(out, { recursive: true, force: true });
                await fs.mkdir(out, { recursive: true });
                bus.publish("function.build.started", { functionID });
                if (func.hooks?.beforeBuild)
                    await func.hooks.beforeBuild(func, out);
                const built = await handler.build({
                    functionID,
                    out,
                    mode,
                    props: func,
                });
                if (built.type === "error") {
                    bus.publish("function.build.failed", {
                        functionID,
                        errors: built.errors,
                    });
                    return built;
                }
                if (func.copyFiles) {
                    await Promise.all(func.copyFiles.map(async (entry) => {
                        const fromPath = path.join(project.paths.root, entry.from);
                        const to = entry.to || entry.from;
                        if (path.isAbsolute(to))
                            throw new Error(`Copy destination path "${to}" must be relative`);
                        const toPath = path.join(out, to);
                        if (mode === "deploy")
                            await fs.cp(fromPath, toPath, {
                                recursive: true,
                            });
                        if (mode === "start") {
                            try {
                                const dir = path.dirname(toPath);
                                await fs.mkdir(dir, { recursive: true });
                                await fs.symlink(fromPath, toPath);
                            }
                            catch (ex) {
                                Logger.debug("Failed to symlink", fromPath, toPath, ex);
                            }
                        }
                    }));
                }
                if (func.hooks?.afterBuild)
                    await func.hooks.afterBuild(func, out);
                bus.publish("function.build.success", { functionID });
                return {
                    ...built,
                    out,
                    sourcemap: built.sourcemap,
                };
            }
            if (pendingBuilds.has(functionID)) {
                Logger.debug("Waiting on pending build", functionID);
                return pendingBuilds.get(functionID);
            }
            const promise = task();
            pendingBuilds.set(functionID, promise);
            Logger.debug("Building function", functionID);
            try {
                return await promise;
            }
            finally {
                pendingBuilds.delete(functionID);
            }
        },
    };
    return result;
});
export const useFunctionBuilder = lazy(() => {
    const artifacts = new Map();
    const handlers = useRuntimeHandlers();
    const semaphore = new Semaphore(4);
    const result = {
        artifact: (functionID) => {
            if (artifacts.has(functionID))
                return artifacts.get(functionID);
            return result.build(functionID);
        },
        build: async (functionID) => {
            const unlock = await semaphore.lock();
            try {
                const result = await handlers.build(functionID, "start");
                if (!result)
                    return;
                if (result.type === "error")
                    return;
                artifacts.set(functionID, result);
                return artifacts.get(functionID);
            }
            finally {
                unlock();
            }
        },
    };
    const watcher = useWatcher();
    watcher.subscribe("file.changed", async (evt) => {
        try {
            const functions = useFunctions();
            for (const [functionID, info] of Object.entries(functions.all)) {
                const handler = handlers.for(info.runtime);
                if (!handler?.shouldBuild({
                    functionID,
                    file: evt.properties.file,
                }))
                    continue;
                await result.build(functionID);
                Logger.debug("Rebuilt function", functionID);
            }
        }
        catch { }
    });
    return result;
});
