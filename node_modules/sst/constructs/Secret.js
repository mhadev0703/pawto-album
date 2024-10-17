import { Construct } from "constructs";
import { Stack } from "./Stack.js";
import { getParameterPath, getParameterFallbackPath, } from "./util/functionBinding.js";
/**
 * The `Secret` construct is a higher level CDK construct that makes it easy to manage app secrets.
 *
 * @example
 * ### Using the minimal config
 *
 * ```js
 * import { Config } from "sst/constructs";
 *
 * new Config.Secret(stack, "STRIPE_KEY");
 * ```
 */
export class Secret extends Construct {
    id;
    name;
    constructor(scope, id) {
        super(scope, id);
        this.id = id;
        this.name = id;
        const app = this.node.root;
        app.registerTypes(this);
    }
    /** @internal */
    getConstructMetadata() {
        return {
            type: "Secret",
            data: {
                name: this.name,
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        const app = this.node.root;
        const partition = Stack.of(this).partition;
        return {
            clientPackage: "config",
            variables: {
                value: {
                    type: "secret",
                },
            },
            permissions: {
                "ssm:GetParameters": [
                    `arn:${partition}:ssm:${app.region}:${app.account}:parameter${getParameterPath(this, "value")}`,
                    `arn:${partition}:ssm:${app.region}:${app.account}:parameter${getParameterFallbackPath(this, "value")}`,
                ],
            },
        };
    }
    static create(scope, ...parameters) {
        const result = {};
        for (const name of parameters) {
            result[name] = new Secret(scope, name);
        }
        return result;
    }
}
