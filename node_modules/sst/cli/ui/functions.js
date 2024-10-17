import { dim } from "colorette";
import { Text } from "ink";
import Spinner from "ink-spinner";
import React, { useEffect, useState } from "react";
import { useBus } from "../../bus.js";
import { useFunctions } from "../../constructs/Function.js";
import { Colors } from "../colors.js";
export function Functions() {
    const [functions, setFunctions] = useState({});
    useEffect(() => {
        const bus = useBus();
        const invoke = bus.subscribe("function.invoked", (evt) => {
            setFunctions((functions) => {
                setTimeout(() => {
                    setFunctions((functions) => {
                        const existing = functions[evt.properties.requestID];
                        if (!existing)
                            return functions;
                        return { ...functions };
                    });
                }, 500);
                return {
                    ...functions,
                    [evt.properties.requestID]: {
                        requestID: evt.properties.requestID,
                        functionID: evt.properties.functionID,
                        started: Date.now(),
                        logs: [],
                    },
                };
            });
        });
        const stdout = bus.subscribe("worker.stdout", (evt) => {
            setFunctions((functions) => {
                const existing = functions[evt.properties.requestID];
                if (!existing)
                    return functions;
                return {
                    ...functions,
                    [evt.properties.requestID]: {
                        ...existing,
                        logs: [...existing.logs, evt.properties.message],
                    },
                };
            });
        });
        // This is all ugly but the timeouts are for UI smootheness
        const success = bus.subscribe("function.success", (evt) => {
            function print(input, diff) {
                setTimeout(() => {
                    console.log(Colors.primary(`  ➜ `), useFunctions().fromID(input.functionID)?.handler);
                    for (const log of input.logs) {
                        console.log(`     ${dim(log)}`);
                    }
                    console.log(`     ${dim(`Done in ${diff}ms`)}`);
                    console.log();
                }, diff > 500 ? 60 : 0);
            }
            setFunctions((functions) => {
                const { [evt.properties.requestID]: existing, ...next } = functions;
                if (!existing)
                    return functions;
                const diff = Date.now() - existing.started;
                if (diff > 500 && diff < 1500) {
                    setTimeout(() => {
                        setFunctions((functions) => {
                            const { [evt.properties.requestID]: existing, ...next } = functions;
                            print(existing, diff);
                            return next;
                        });
                    }, 1500 - diff);
                    return functions;
                }
                print(existing, diff);
                return next;
            });
        });
        const error = bus.subscribe("function.error", (evt) => {
            function print(input, diff) {
                setTimeout(() => {
                    console.log(Colors.primary(`  ➜ `), useFunctions().fromID(input.functionID)?.handler);
                    for (const log of input.logs) {
                        console.log(`     ${dim(log)}`);
                    }
                    console.log(`     ${Colors.danger(evt.properties.errorMessage)}`);
                    for (const line of evt.properties.trace || []) {
                        console.log(`     ${dim(line)}`);
                    }
                    console.log();
                }, diff > 500 ? 60 : 0);
            }
            setFunctions((functions) => {
                const { [evt.properties.requestID]: existing, ...next } = functions;
                if (!existing)
                    return functions;
                const diff = Date.now() - existing.started;
                if (diff > 500 && diff < 1500) {
                    setTimeout(() => {
                        setFunctions((functions) => {
                            const { [evt.properties.requestID]: existing, ...next } = functions;
                            print(existing, diff);
                            return next;
                        });
                    }, 1500 - diff);
                    return functions;
                }
                print(existing, diff);
                return next;
            });
        });
        return () => {
            bus.unsubscribe(invoke);
            bus.unsubscribe(success);
            bus.unsubscribe(error);
            bus.unsubscribe(stdout);
        };
    }, []);
    return (React.createElement(React.Fragment, null, Object.values(functions)
        .filter((f) => Date.now() - f.started >= 500)
        .map((evt) => (React.createElement(React.Fragment, { key: evt.requestID },
        React.createElement(Text, null,
            "  ",
            React.createElement(Spinner, null),
            "  ",
            useFunctions().fromID(evt.functionID)?.handler),
        evt.logs.map((log, index) => (React.createElement(Text, { dimColor: true, key: index },
            "     ",
            log))),
        React.createElement(Text, null, " "))))));
}
