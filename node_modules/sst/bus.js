import crypto from "crypto";
import { Logger } from "./logger.js";
import { lazy } from "./util/lazy.js";
const DO_NOT_LOG = new Set(["stacks.metadata"]);
export const useBus = lazy(() => {
    const subscriptions = {};
    function subscribers(type) {
        let arr = subscriptions[type];
        if (!arr) {
            arr = [];
            subscriptions[type] = arr;
        }
        return arr;
    }
    const sourceID = crypto.randomBytes(16).toString("hex");
    const result = {
        sourceID,
        publish(type, properties) {
            const payload = {
                type,
                properties,
                sourceID,
            };
            if (!DO_NOT_LOG.has(type)) {
                Logger.debug(`Publishing event ${JSON.stringify(payload)}`);
            }
            for (const sub of subscribers(type))
                sub.cb(payload);
        },
        unsubscribe(sub) {
            const arr = subscribers(sub.type);
            const index = arr.indexOf(sub);
            if (index < 0)
                return;
            arr.splice(index, 1);
        },
        subscribe(type, cb) {
            const sub = {
                type,
                cb,
            };
            subscribers(type).push(sub);
            return sub;
        },
        forward(..._types) {
            return (type, cb) => {
                return this.subscribe(type, cb);
            };
        },
    };
    return result;
});
