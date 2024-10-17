import { createProxy } from "../util/index.js";
export const EventBus = 
/* @__PURE__ */ createProxy("EventBus");
import { EventBridgeClient, PutEventsCommand, } from "@aws-sdk/client-eventbridge";
import { z } from "zod";
import { useLoader } from "../util/loader.js";
import { Config } from "../config/index.js";
const client = new EventBridgeClient({});
export function createEventBuilder(props) {
    return function createEvent(type, properties) {
        const propertiesSchema = z.object(properties);
        const metadataSchema = props.metadata
            ? z.object(props.metadata)
            : undefined;
        const publish = async (properties, metadata) => {
            const result = await useLoader("sst.bus.publish", async (input) => {
                const size = 10;
                const promises = [];
                for (let i = 0; i < input.length; i += size) {
                    const chunk = input.slice(i, i + size);
                    promises.push(client.send(new PutEventsCommand({
                        Entries: chunk,
                    })));
                }
                const settled = await Promise.allSettled(promises);
                const result = new Array(input.length);
                for (let i = 0; i < result.length; i++) {
                    const item = settled[Math.floor(i / 10)];
                    if (item.status === "rejected") {
                        result[i] = item.reason;
                        continue;
                    }
                    result[i] = item.value;
                }
                return result;
            })({
                // @ts-expect-error
                EventBusName: EventBus[props.bus].eventBusName,
                // @ts-expect-error
                Source: Config.APP,
                Detail: JSON.stringify({
                    properties: propertiesSchema.parse(properties),
                    metadata: (() => {
                        if (metadataSchema) {
                            return metadataSchema.parse(metadata);
                        }
                        if (props.metadataFn) {
                            return props.metadataFn();
                        }
                    })(),
                }),
                DetailType: type,
            });
            return result;
        };
        return {
            publish: publish,
            type,
            shape: {
                metadata: {},
                properties: {},
                metadataFn: {},
            },
        };
    };
}
export function EventHandler(_events, cb) {
    return async (event) => {
        await cb({
            type: event["detail-type"],
            properties: event.detail.properties,
            metadata: event.detail.metadata,
            attempts: event.attempts ?? 0,
        });
    };
}
