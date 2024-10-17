import { Context } from "../../context/context2.js";
const LoaderContext = Context.memo(() => {
    const loaders = new Map();
    return loaders;
});
export function createLoader(batchFn) {
    let current;
    async function run() {
        const batch = current;
        if (!batch)
            return;
        batchFn(batch.keys).then((result) => {
            for (let i = 0; i < result.length; i++) {
                batch.promises[i](result[i]);
            }
        });
        current = undefined;
    }
    function getBatch() {
        if (current)
            return current;
        process.nextTick(run);
        current = {
            keys: [],
            promises: [],
        };
        return current;
    }
    return (key) => {
        const batch = getBatch();
        batch.keys.push(key);
        const promise = new Promise((resolve, reject) => {
            batch.promises.push((val) => {
                if (val instanceof Error) {
                    reject(val);
                    return;
                }
                resolve(val);
            });
        });
        return promise;
    };
}
export function useLoader(key, batchFn) {
    const loaders = LoaderContext();
    if (loaders.has(key)) {
        return loaders.get(key);
    }
    const loader = createLoader(batchFn);
    loaders.set(key, loader);
    return loader;
}
