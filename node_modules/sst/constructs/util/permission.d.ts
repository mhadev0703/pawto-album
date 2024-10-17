import { IConstruct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
export type Permissions = "*" | Permission[];
type SupportedPermissions = "execute-api" | "appsync" | "dynamodb" | "sns" | "sqs" | "events" | "kinesis" | "s3" | "rds-data" | "secretsmanager" | "lambda" | "ssm";
type Permission = SupportedPermissions | Omit<string, SupportedPermissions> | IConstruct | [IConstruct, string] | iam.PolicyStatement;
export declare function attachPermissionsToRole(role: iam.Role, permissions: Permissions): void;
export declare function attachPermissionsToPolicy(policy: iam.Policy, permissions: Permissions): void;
export {};
