export function lazy(callback) {
    let loaded = false;
    let result;
    return () => {
        if (!loaded || process.env.SST_RESET_LAZY) {
            result = callback();
            loaded = true;
        }
        return result;
    };
}
