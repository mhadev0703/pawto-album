import { AsyncLocalStorage } from "async_hooks";
export class ContextNotFoundError extends Error {
    name;
    constructor(name) {
        super(`${name} context was not provided. It is possible you have multiple versions of SST installed.`);
        this.name = name;
    }
}
let count = 0;
export function create(name) {
    const storage = new AsyncLocalStorage();
    const children = [];
    // notify all memos to reset
    function reset() {
        for (const child of children) {
            child();
        }
    }
    const ctx = {
        name,
        with(value, cb) {
            const version = (++count).toString();
            return storage.run({ value, version }, () => {
                return runWithCleanup(cb, () => reset());
            });
        },
        use() {
            const memo = ContextMemo.getStore();
            // use is being called within a memo, so track dependency
            if (memo) {
                memo.deps.push(ctx);
                children.push(memo.reset);
            }
            const result = storage.getStore();
            if (result === undefined)
                throw new ContextNotFoundError(name);
            return result.value;
        },
        version() {
            const result = storage.getStore();
            if (result === undefined)
                throw new ContextNotFoundError(name);
            return result.version;
        },
    };
    return ctx;
}
const ContextMemo = new AsyncLocalStorage();
export function memo(cb) {
    const deps = [];
    const cache = new Map();
    const children = [];
    let tracked = false;
    function key() {
        return deps.map((dep) => dep.version()).join(",");
    }
    function reset() {
        cache.delete(key());
        for (const child of children) {
            child();
        }
    }
    function save(value) {
        cache.set(key(), value);
    }
    return () => {
        const child = ContextMemo.getStore();
        if (child) {
            child.deps.push({ version: () => key() });
            children.push(child.reset);
        }
        // Memo never run so build up dependency list
        if (!tracked) {
            return ContextMemo.run({ deps, reset }, () => {
                return runWithCleanup(cb, (result) => {
                    tracked = true;
                    save(result);
                });
            });
        }
        const cached = cache.get(key());
        if (cached) {
            return cached;
        }
        const result = cb();
        save(result);
        return result;
    };
}
function runWithCleanup(cb, cleanup) {
    const result = cb();
    if (result &&
        typeof result === "object" &&
        "then" in result &&
        typeof result.then === "function") {
        return result.then((value) => {
            // cleanup
            cleanup(result);
            return value;
        });
    }
    cleanup(result);
    return result;
}
export const Context = {
    create,
    memo,
};
