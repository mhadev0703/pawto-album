import { Construct } from "constructs";
import { Function as CdkFunction } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { SSTConstruct } from "./Construct.js";
import { NodeJSProps, FunctionCopyFilesProps } from "./Function.js";
import { Duration } from "./util/duration.js";
import { Permissions } from "./util/permission.js";
import { FunctionBindingProps } from "./util/functionBinding.js";
import { ISecurityGroup, IVpc, SubnetSelection } from "aws-cdk-lib/aws-ec2";
export type JobMemorySize = "3 GB" | "7 GB" | "15 GB" | "145 GB";
export interface JobNodeJSProps extends NodeJSProps {
}
export interface JobContainerProps {
    /**
     * Specify or override the CMD on the Docker image.
     * @example
     * ```js
     * container: {
     *   cmd: ["python3", "my_script.py"]
     * }
     * ```
     */
    cmd: string[];
    /**
     * Name of the Dockerfile.
     * @example
     * ```js
     * container: {
     *   file: "path/to/Dockerfile.prod"
     * }
     * ```
     */
    file?: string;
    /**
     * Build args to pass to the docker build command.
     * @default No build args
     * @example
     * ```js
     * container: {
     *   buildArgs: {
     *     FOO: "bar"
     *   }
     * }
     * ```
     */
    buildArgs?: Record<string, string>;
}
export interface JobProps {
    /**
     * The CPU architecture of the job.
     * @default "x86_64"
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   architecture: "arm_64",
     *   handler: "src/job.handler",
     * })
     * ```
     */
    architecture?: "x86_64" | "arm_64";
    /**
     * The runtime environment for the job.
     * @default "nodejs"
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   runtime: "container",
     *   handler: "src/job",
     * })
     *```
     */
    runtime?: "nodejs" | "container";
    /**
     * For "nodejs" runtime, point to the entry point and handler function.
     * Of the format: `/path/to/file.function`.
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     * })
     *```
     *
     * For "container" runtime, point the handler to the directory containing
     * the Dockerfile.
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   runtime: "container",
     *   handler: "src/job", // Dockerfile is at "src/job/Dockerfile"
     * })
     *```
     */
    handler: string;
    /**
     * The amount of memory in MB allocated.
     *
     * @default "3 GB"
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     *   memorySize: "3 GB",
     * })
     *```
     */
    memorySize?: JobMemorySize;
    /**
     * The execution timeout. Minimum 5 minutes. Maximum 8 hours.
     *
     * @default "8 hours"
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     *   timeout: "30 minutes",
     * })
     *```
     */
    timeout?: Duration;
    /**
     * Used to configure additional files to copy into the function bundle
     *
     * @example
     * ```js
     * new Job(stack, "job", {
     *   copyFiles: [{ from: "src/index.js" }]
     * })
     *```
     */
    copyFiles?: FunctionCopyFilesProps[];
    /**
     * Used to configure nodejs function properties
     */
    nodejs?: JobNodeJSProps;
    /**
     * Used to configure container properties
     */
    container?: JobContainerProps;
    /**
     * Can be used to disable Live Lambda Development when using `sst start`. Useful for things like Custom Resources that need to execute during deployment.
     *
     * @default true
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     *   enableLiveDev: false
     * })
     *```
     */
    enableLiveDev?: boolean;
    /**
     * Configure environment variables for the job
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     *   environment: {
     *     DEBUG: "*",
     *   }
     * })
     * ```
     */
    environment?: Record<string, string>;
    /**
     * Bind resources for the job
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     *   bind: [STRIPE_KEY, bucket],
     * })
     * ```
     */
    bind?: SSTConstruct[];
    /**
     * Attaches the given list of permissions to the job. Configuring this property is equivalent to calling `attachPermissions()` after the job is created.
     *
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     *   permissions: ["ses"]
     * })
     * ```
     */
    permissions?: Permissions;
    /**
     * The duration logs are kept in CloudWatch Logs.
     * @default Logs retained indefinitely
     * @example
     * ```js
     * new Job(stack, "MyJob", {
     *   handler: "src/job.handler",
     *   logRetention: "one_week"
     * })
     * ```
     */
    logRetention?: Lowercase<keyof typeof RetentionDays>;
    cdk?: {
        /**
         * Allows you to override default id for this construct.
         */
        id?: string;
        /**
         * Runs codebuild job in the specified VPC. Note this will only work once deployed.
         *
         * @example
         * ```js
         * new Job(stack, "MyJob", {
         *   handler: "src/job.handler",
         *   cdk: {
         *     vpc: Vpc.fromLookup(stack, "VPC", {
         *       vpcId: "vpc-xxxxxxxxxx",
         *     }),
         *   }
         * })
         * ```
         */
        vpc?: IVpc;
        /**
         * Where to place the network interfaces within the VPC.
         * @default All private subnets.
         * @example
         * ```js
         * import { SubnetType } from "aws-cdk-lib/aws-ec2";
         *
         * new Job(stack, "MyJob", {
         *   handler: "src/job.handler",
         *   cdk: {
         *     vpc,
         *     vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS }
         *   }
         * })
         * ```
         */
        vpcSubnets?: SubnetSelection;
        /**
         * The list of security groups to associate with the Job's network interfaces.
         * @default A new security group is created.
         * @example
         * ```js
         * import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
         *
         * new Job(stack, "MyJob", {
         *   handler: "src/job.handler",
         *   cdk: {
         *     vpc,
         *     securityGroups: [
         *       new SecurityGroup(stack, "MyJobSG", { vpc })
         *     ]
         *   }
         * })
         * ```
         */
        securityGroups?: ISecurityGroup[];
    };
}
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
export declare class Job extends Construct implements SSTConstruct {
    readonly id: string;
    private readonly props;
    private readonly job;
    private readonly liveDevJob?;
    readonly _jobManager: CdkFunction;
    constructor(scope: Construct, id: string, props: JobProps);
    getConstructMetadata(): {
        type: "Job";
        data: {
            handler: string;
        };
    };
    /** @internal */
    getFunctionBinding(): FunctionBindingProps;
    /**
     * Binds additional resources to job.
     *
     * @example
     * ```js
     * job.bind([STRIPE_KEY, bucket]);
     * ```
     */
    bind(constructs: SSTConstruct[]): void;
    /**
     * Attaches the given list of [permissions](Permissions.md) to the job. This allows the job to access other AWS resources.
     *
     * @example
     * ```js
     * job.attachPermissions(["ses"]);
     * ```
     */
    attachPermissions(permissions: Permissions): void;
    /**
     * Attaches additional environment variable to the job.
     *
     * @example
     * ```js
     * fn.addEnvironment({
     *   DEBUG: "*"
     * });
     * ```
     */
    addEnvironment(name: string, value: string): void;
    private createCodeBuildJob;
    private createLiveDevJob;
    private createLogRetention;
    private buildCodeBuildProjectCode;
    private createJobManager;
    private bindForCodeBuild;
    private attachPermissionsForCodeBuild;
    private addEnvironmentForCodeBuild;
    private validateContainerProps;
    private validateMemoryProps;
    private normalizeMemorySize;
    private normalizeTimeout;
    private convertJobRuntimeToFunctionRuntime;
}
