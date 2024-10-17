const AppContext = (() => {
    let app;
    const children = new Map();
    return {
        set(input) {
            children.clear();
            app = input;
        },
        get current() {
            return app;
        },
        createAppContext(cb) {
            return () => {
                const exists = children.get(cb);
                if (exists)
                    return exists;
                const val = cb();
                children.set(cb, val);
                return val;
            };
        },
    };
})();
export function provideApp(app) {
    AppContext.set(app);
}
export const createAppContext = AppContext.createAppContext;
