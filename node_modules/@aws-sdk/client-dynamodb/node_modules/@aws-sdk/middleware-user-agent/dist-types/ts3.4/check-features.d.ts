import { AccountIdEndpointMode } from "@aws-sdk/core/account-id-endpoint";
import { AwsHandlerExecutionContext } from "@aws-sdk/types";
import {
  AwsCredentialIdentityProvider,
  BuildHandlerArguments,
  Provider,
} from "@smithy/types";
type PreviouslyResolved = Partial<{
  credentials?: AwsCredentialIdentityProvider;
  accountIdEndpointMode?: Provider<AccountIdEndpointMode>;
}>;
export declare function checkFeatures(
  context: AwsHandlerExecutionContext,
  config: PreviouslyResolved,
  args: BuildHandlerArguments<any>
): Promise<void>;
export {};
