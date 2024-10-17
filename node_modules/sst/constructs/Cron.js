import { Construct } from "constructs";
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import { getFunctionRef } from "./Construct.js";
import { Function as Func, } from "./Function.js";
/////////////////////
// Construct
/////////////////////
/**
 * The `Cron` construct is a higher level CDK construct that makes it easy to create a cron job.
 *
 * @example
 *
 * ```js
 * import { Cron } from "sst/constructs";
 *
 * new Cron(stack, "Cron", {
 *   schedule: "rate(1 minute)",
 *   job: "src/lambda.main",
 * });
 * ```
 */
export class Cron extends Construct {
    id;
    cdk;
    /**
     * The internally created Function instance that'll be run on schedule.
     */
    jobFunction;
    props;
    constructor(scope, id, props) {
        super(scope, props.cdk?.id || id);
        this.id = id;
        this.props = props;
        this.cdk = {};
        this.createEventsRule();
        this.jobFunction = this.createRuleTarget();
        const app = this.node.root;
        app.registerTypes(this);
    }
    /**
     * Binds the given list of resources to the cron job.
     *
     * @example
     *
     * ```js
     * cron.bind([STRIPE_KEY, bucket]);
     * ```
     *
     */
    bind(constructs) {
        this.jobFunction.bind(constructs);
    }
    /**
     * Attaches the given list of permissions to the cron job. This allows the function to access other AWS resources.
     *
     * @example
     *
     * ```js
     * cron.attachPermissions(["s3"]);
     * ```
     *
     */
    attachPermissions(permissions) {
        this.jobFunction.attachPermissions(permissions);
    }
    getConstructMetadata() {
        const cfnRule = this.cdk.rule.node.defaultChild;
        return {
            type: "Cron",
            data: {
                schedule: cfnRule.scheduleExpression,
                ruleName: this.cdk.rule.ruleName,
                job: getFunctionRef(this.jobFunction),
            },
        };
    }
    /** @internal */
    getFunctionBinding() {
        return undefined;
    }
    createEventsRule() {
        const { cdk, schedule, enabled } = this.props;
        const id = this.node.id;
        // Configure Schedule
        if (!schedule && !cdk?.rule?.schedule) {
            throw new Error(`No schedule defined for the "${id}" Cron`);
        }
        this.cdk.rule = new events.Rule(this, "Rule", {
            schedule: schedule && events.Schedule.expression(schedule),
            enabled: enabled === false ? false : true,
            ...cdk?.rule,
        });
    }
    createRuleTarget() {
        const { job } = this.props;
        const id = this.node.id;
        if (!job) {
            throw new Error(`No job defined for the "${id}" Cron`);
        }
        // normalize job
        let jobFunction, jobProps;
        if (job.function) {
            jobFunction = job.function;
            jobProps = job.cdk?.target;
        }
        else {
            jobFunction = job;
            jobProps = {};
        }
        // create function
        const fn = Func.fromDefinition(this, `Job_${this.node.id}`, jobFunction);
        this.cdk.rule.addTarget(new eventsTargets.LambdaFunction(fn, jobProps));
        return fn;
    }
}
