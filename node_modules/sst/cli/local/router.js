import * as trpc from "@trpc/server";
import { useProject } from "../../project.js";
import { useBus } from "../../bus.js";
import { useAWSCredentials } from "../../credentials.js";
export const router = trpc
    .router()
    .query("getCredentials", {
    async resolve({ ctx }) {
        const project = useProject();
        const credentials = await useAWSCredentials();
        return {
            region: project.config.region,
            credentials: {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
                sessionToken: credentials.sessionToken,
            },
        };
    },
})
    .query("getState", {
    async resolve({ ctx }) {
        return ctx.state;
    },
})
    .mutation("deploy", {
    async resolve() {
        return;
    },
})
    .subscription("onStateChange", {
    async resolve({ ctx }) {
        const bus = useBus();
        return new trpc.Subscription((emit) => {
            const sub = bus.subscribe("local.patches", (evt) => {
                emit.data(evt.properties);
            });
            return () => {
                bus.unsubscribe(sub);
            };
        });
    },
});
