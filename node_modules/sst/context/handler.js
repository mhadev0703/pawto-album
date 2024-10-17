import { create } from "./context2.js";
const RequestContext = create("RequestContext");
export function useContextType() {
    const ctx = RequestContext.use();
    return ctx.type;
}
export function useEvent(type) {
    const ctx = RequestContext.use();
    if (ctx.type !== type)
        throw new Error(`Expected ${type} event`);
    return ctx.event;
}
export function useLambdaContext() {
    const ctx = RequestContext.use();
    return ctx.context;
}
export function Handler(type, cb) {
    return function handler(event, context) {
        return RequestContext.with({ type, event: event, context }, () => cb(event, context));
    };
}
