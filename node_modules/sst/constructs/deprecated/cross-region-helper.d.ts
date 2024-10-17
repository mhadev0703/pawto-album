import { Construct } from "constructs";
import { CustomResource } from "aws-cdk-lib/core";
import * as iam from "aws-cdk-lib/aws-iam";
export declare function getOrCreateBucket(scope: Construct): CustomResource;
export declare function createFunction(scope: Construct, name: string, role: iam.Role, bucketName: string, functionParams: any): CustomResource;
export declare function createVersion(scope: Construct, name: string, functionArn: string): CustomResource;
export declare function updateVersionLogicalId(functionCR: CustomResource, versionCR: CustomResource): void;
