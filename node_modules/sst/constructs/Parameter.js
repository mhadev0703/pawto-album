import { Construct } from "constructs";
/**
 * The `Parameter` construct is a higher level CDK construct that makes it easy to manage app environment variables.
 *
 * @example
 * ### Using the minimal config
 *
 * ```js
 * import { Config } from "sst/constructs";
 *
 * new Config.Parameter(stack, "TABLE_NAME", table.tableName);
 * ```
 */
export class Parameter extends Construct {
    id;
    name;
    value;
    constructor(scope, id, props) {
        super(scope, id);
        this.id = id;
        this.name = id;
        this.value = props.value;
        const app = this.node.root;
        app.registerTypes(this);
    }
    /** @internal */
    getConstructMetadata() {
        return {
            type: "Parameter",
            data: {
                name: this.name,
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        return {
            clientPackage: "config",
            variables: {
                value: {
                    type: "plain",
                    value: this.value,
                },
            },
            permissions: {},
        };
    }
    static create(scope, parameters) {
        const result = {};
        for (const [name, value] of Object.entries(parameters)) {
            result[name] = new Parameter(scope, name, { value });
        }
        return result;
    }
}
