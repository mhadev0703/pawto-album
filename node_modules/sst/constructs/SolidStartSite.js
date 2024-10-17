import fs from "fs";
import path from "path";
import { SsrSite } from "./SsrSite.js";
/**
 * The `SolidStartSite` construct is a higher level CDK construct that makes it easy to create a SolidStart app.
 * @example
 * Deploys a SolidStart app in the `my-solid-start-app` directory.
 *
 * ```js
 * new SolidStartSite(stack, "web", {
 *   path: "my-solid-start-app/",
 * });
 * ```
 */
export class SolidStartSite extends SsrSite {
    constructor(scope, id, props) {
        super(scope, id, props);
    }
    plan() {
        const { path: sitePath, edge } = this.props;
        const serverConfig = {
            description: "Server handler for Solid",
            handler: path.join(sitePath, "dist", "server", "index.handler"),
        };
        return this.validatePlan({
            edge: edge ?? false,
            cloudFrontFunctions: {
                serverCfFunction: {
                    constructId: "CloudFrontFunction",
                    injections: [this.useCloudFrontFunctionHostHeaderInjection()],
                },
            },
            edgeFunctions: edge
                ? {
                    edgeServer: {
                        constructId: "Server",
                        function: {
                            scopeOverride: this,
                            ...serverConfig,
                        },
                    },
                }
                : undefined,
            origins: {
                ...(edge
                    ? {}
                    : {
                        regionalServer: {
                            type: "function",
                            constructId: "ServerFunction",
                            function: serverConfig,
                        },
                    }),
                s3: {
                    type: "s3",
                    copy: [
                        {
                            from: "dist/client",
                            to: "",
                            cached: true,
                            versionedSubDir: "assets",
                        },
                    ],
                },
            },
            behaviors: [
                edge
                    ? {
                        cacheType: "server",
                        cfFunction: "serverCfFunction",
                        edgeFunction: "edgeServer",
                        origin: "s3",
                    }
                    : {
                        cacheType: "server",
                        cfFunction: "serverCfFunction",
                        origin: "regionalServer",
                    },
                // create 1 behaviour for each top level asset file/folder
                ...fs.readdirSync(path.join(sitePath, "dist/client")).map((item) => ({
                    cacheType: "static",
                    pattern: fs
                        .statSync(path.join(sitePath, "dist/client", item))
                        .isDirectory()
                        ? `${item}/*`
                        : item,
                    origin: "s3",
                })),
            ],
        });
    }
    getConstructMetadata() {
        return {
            type: "SolidStartSite",
            ...this.getConstructMetadataBase(),
        };
    }
}
