// Copied from https://github.com/aws/aws-cdk/blob/main/packages/aws-cdk/lib/api/cloudformation-deployments.ts
import * as cxapi from "@aws-cdk/cx-api";
import * as cdk_assets from "cdk-assets";
import { AssetManifest } from "cdk-assets";
import { debug, warning } from "sst-aws-cdk/lib/logging.js";
import { buildAssets, publishAssets, PublishingAws, EVENT_TO_LOGGER, } from "sst-aws-cdk/lib/util/asset-publishing.js";
import { Mode } from "sst-aws-cdk/lib/api/aws-auth/credentials.js";
import { deployStack, destroyStack, makeBodyParameterAndUpload, } from "./deploy-stack.js";
import { EnvironmentResourcesRegistry, } from "sst-aws-cdk/lib/api/environment-resources.js";
import { loadCurrentTemplateWithNestedStacks, loadCurrentTemplate, flattenNestedStackNames, } from "sst-aws-cdk/lib/api/nested-stack-helpers.js";
import { CloudFormationStack, } from "sst-aws-cdk/lib/api/util/cloudformation.js";
import { replaceEnvPlaceholders } from "sst-aws-cdk/lib/api/util/placeholders.js";
/**
 * Scope for a single set of deployments from a set of Cloud Assembly Artifacts
 *
 * Manages lookup of SDKs, Bootstrap stacks, etc.
 */
export class Deployments {
    props;
    sdkProvider;
    sdkCache = new Map();
    publisherCache = new Map();
    environmentResources;
    constructor(props) {
        this.props = props;
        this.sdkProvider = props.sdkProvider;
        this.environmentResources = new EnvironmentResourcesRegistry(props.toolkitStackName);
    }
    async readCurrentTemplateWithNestedStacks(rootStackArtifact, retrieveProcessedTemplate = false) {
        const sdk = (await this.prepareSdkWithLookupOrDeployRole(rootStackArtifact))
            .stackSdk;
        const templateWithNestedStacks = await loadCurrentTemplateWithNestedStacks(rootStackArtifact, sdk, retrieveProcessedTemplate);
        return {
            deployedTemplate: templateWithNestedStacks.deployedTemplate,
            nestedStackCount: flattenNestedStackNames(templateWithNestedStacks.nestedStackNames).length,
        };
    }
    async readCurrentTemplate(stackArtifact) {
        debug(`Reading existing template for stack ${stackArtifact.displayName}.`);
        const sdk = (await this.prepareSdkWithLookupOrDeployRole(stackArtifact))
            .stackSdk;
        return loadCurrentTemplate(stackArtifact, sdk);
    }
    async resourceIdentifierSummaries(stackArtifact) {
        debug(`Retrieving template summary for stack ${stackArtifact.displayName}.`);
        // Currently, needs to use `deploy-role` since it may need to read templates in the staging
        // bucket which have been encrypted with a KMS key (and lookup-role may not read encrypted things)
        const { stackSdk, resolvedEnvironment, envResources } = await this.prepareSdkFor(stackArtifact, undefined, Mode.ForReading);
        const cfn = stackSdk.cloudFormation();
        // Upload the template, if necessary, before passing it to CFN
        const cfnParam = await makeBodyParameterAndUpload(stackArtifact, resolvedEnvironment, envResources, this.sdkProvider, stackSdk);
        const response = await cfn.getTemplateSummary(cfnParam).promise();
        if (!response.ResourceIdentifierSummaries) {
            debug('GetTemplateSummary API call did not return "ResourceIdentifierSummaries"');
        }
        return response.ResourceIdentifierSummaries ?? [];
    }
    async deployStack(options) {
        let deploymentMethod = options.deploymentMethod;
        if (options.changeSetName || options.execute !== undefined) {
            if (deploymentMethod) {
                throw new Error("You cannot supply both 'deploymentMethod' and 'changeSetName/execute'. Supply one or the other.");
            }
            deploymentMethod = {
                method: "change-set",
                changeSetName: options.changeSetName,
                execute: options.execute,
            };
        }
        const { stackSdk, resolvedEnvironment, cloudFormationRoleArn, envResources, } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);
        // Do a verification of the bootstrap stack version
        await this.validateBootstrapStackVersion(options.stack.stackName, options.stack.requiresBootstrapStackVersion, options.stack.bootstrapStackVersionSsmParameter, envResources);
        // Deploy assets
        const assetArtifacts = options.stack.dependencies.filter(cxapi.AssetManifestArtifact.isAssetManifestArtifact);
        for (const asset of assetArtifacts) {
            const manifest = AssetManifest.fromFile(asset.file);
            await publishAssets(manifest, this.sdkProvider, resolvedEnvironment, {
                buildAssets: true,
                quiet: options.quiet,
                parallel: options.assetParallelism,
            });
        }
        return deployStack({
            stack: options.stack,
            noMonitor: true,
            resolvedEnvironment,
            deployName: options.deployName,
            notificationArns: options.notificationArns,
            quiet: options.quiet,
            sdk: stackSdk,
            sdkProvider: this.sdkProvider,
            roleArn: cloudFormationRoleArn,
            reuseAssets: options.reuseAssets,
            envResources,
            tags: options.tags,
            deploymentMethod,
            force: options.force,
            parameters: options.parameters,
            usePreviousParameters: options.usePreviousParameters,
            progress: options.progress,
            ci: options.ci,
            rollback: options.rollback,
            hotswap: options.hotswap,
            extraUserAgent: options.extraUserAgent,
            resourcesToImport: options.resourcesToImport,
            overrideTemplate: options.overrideTemplate,
            assetParallelism: options.assetParallelism,
        });
    }
    async destroyStack(options) {
        const { stackSdk, cloudFormationRoleArn: roleArn } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);
        return destroyStack({
            sdk: stackSdk,
            roleArn,
            stack: options.stack,
            deployName: options.deployName,
            quiet: options.quiet,
            ci: options.ci,
        });
    }
    async stackExists(options) {
        const { stackSdk } = await this.prepareSdkFor(options.stack, undefined, Mode.ForReading);
        const stack = await CloudFormationStack.lookup(stackSdk.cloudFormation(), options.deployName ?? options.stack.stackName);
        return stack.exists;
    }
    async prepareSdkWithLookupOrDeployRole(stackArtifact) {
        // try to assume the lookup role
        try {
            const result = await this.prepareSdkWithLookupRoleFor(stackArtifact);
            if (result.didAssumeRole) {
                return {
                    resolvedEnvironment: result.resolvedEnvironment,
                    stackSdk: result.sdk,
                    envResources: result.envResources,
                };
            }
        }
        catch { }
        // fall back to the deploy role
        return this.prepareSdkFor(stackArtifact, undefined, Mode.ForReading);
    }
    /**
     * Get the environment necessary for touching the given stack
     *
     * Returns the following:
     *
     * - The resolved environment for the stack (no more 'unknown-account/unknown-region')
     * - SDK loaded with the right credentials for calling `CreateChangeSet`.
     * - The Execution Role that should be passed to CloudFormation.
     */
    async prepareSdkFor(stack, roleArn, mode) {
        if (!stack.environment) {
            throw new Error(`The stack ${stack.displayName} does not have an environment`);
        }
        const resolvedEnvironment = await this.sdkProvider.resolveEnvironment(stack.environment);
        // Substitute any placeholders with information about the current environment
        const arns = await replaceEnvPlaceholders({
            assumeRoleArn: stack.assumeRoleArn,
            // Use the override if given, otherwise use the field from the stack
            cloudFormationRoleArn: roleArn ?? stack.cloudFormationExecutionRoleArn,
        }, resolvedEnvironment, this.sdkProvider);
        const stackSdk = await this.cachedSdkForEnvironment(resolvedEnvironment, mode, {
            assumeRoleArn: arns.assumeRoleArn,
            assumeRoleExternalId: stack.assumeRoleExternalId,
        });
        return {
            stackSdk: stackSdk.sdk,
            resolvedEnvironment,
            cloudFormationRoleArn: arns.cloudFormationRoleArn,
            envResources: this.environmentResources.for(resolvedEnvironment, stackSdk.sdk),
        };
    }
    /**
     * Try to use the bootstrap lookupRole. There are two scenarios that are handled here
     *  1. The lookup role may not exist (it was added in bootstrap stack version 7)
     *  2. The lookup role may not have the correct permissions (ReadOnlyAccess was added in
     *      bootstrap stack version 8)
     *
     * In the case of 1 (lookup role doesn't exist) `forEnvironment` will either:
     *   1. Return the default credentials if the default credentials are for the stack account
     *   2. Throw an error if the default credentials are not for the stack account.
     *
     * If we successfully assume the lookup role we then proceed to 2 and check whether the bootstrap
     * stack version is valid. If it is not we throw an error which should be handled in the calling
     * function (and fallback to use a different role, etc)
     *
     * If we do not successfully assume the lookup role, but do get back the default credentials
     * then return those and note that we are returning the default credentials. The calling
     * function can then decide to use them or fallback to another role.
     */
    async prepareSdkWithLookupRoleFor(stack) {
        const resolvedEnvironment = await this.sdkProvider.resolveEnvironment(stack.environment);
        // Substitute any placeholders with information about the current environment
        const arns = await replaceEnvPlaceholders({
            lookupRoleArn: stack.lookupRole?.arn,
        }, resolvedEnvironment, this.sdkProvider);
        // try to assume the lookup role
        const warningMessage = `Could not assume ${arns.lookupRoleArn}, proceeding anyway.`;
        const upgradeMessage = `(To get rid of this warning, please upgrade to bootstrap version >= ${stack.lookupRole?.requiresBootstrapStackVersion})`;
        try {
            const stackSdk = await this.cachedSdkForEnvironment(resolvedEnvironment, Mode.ForReading, {
                assumeRoleArn: arns.lookupRoleArn,
                assumeRoleExternalId: stack.lookupRole?.assumeRoleExternalId,
            });
            const envResources = this.environmentResources.for(resolvedEnvironment, stackSdk.sdk);
            // if we succeed in assuming the lookup role, make sure we have the correct bootstrap stack version
            if (stackSdk.didAssumeRole &&
                stack.lookupRole?.bootstrapStackVersionSsmParameter &&
                stack.lookupRole.requiresBootstrapStackVersion) {
                const version = await envResources.versionFromSsmParameter(stack.lookupRole.bootstrapStackVersionSsmParameter);
                if (version < stack.lookupRole.requiresBootstrapStackVersion) {
                    throw new Error(`Bootstrap stack version '${stack.lookupRole.requiresBootstrapStackVersion}' is required, found version '${version}'.`);
                }
                // we may not have assumed the lookup role because one was not provided
                // if that is the case then don't print the upgrade warning
            }
            else if (!stackSdk.didAssumeRole &&
                stack.lookupRole?.requiresBootstrapStackVersion) {
                warning(upgradeMessage);
            }
            return { ...stackSdk, resolvedEnvironment, envResources };
        }
        catch (e) {
            debug(e);
            // only print out the warnings if the lookupRole exists AND there is a required
            // bootstrap version, otherwise the warnings will print `undefined`
            if (stack.lookupRole && stack.lookupRole.requiresBootstrapStackVersion) {
                warning(warningMessage);
                warning(upgradeMessage);
            }
            throw e;
        }
    }
    async prepareAndValidateAssets(asset, options) {
        const { envResources } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);
        await this.validateBootstrapStackVersion(options.stack.stackName, asset.requiresBootstrapStackVersion, asset.bootstrapStackVersionSsmParameter, envResources);
        const manifest = AssetManifest.fromFile(asset.file);
        return { manifest, stackEnv: envResources.environment };
    }
    /**
     * Build all assets in a manifest
     *
     * @deprecated Use `buildSingleAsset` instead
     */
    async buildAssets(asset, options) {
        const { manifest, stackEnv } = await this.prepareAndValidateAssets(asset, options);
        await buildAssets(manifest, this.sdkProvider, stackEnv, options.buildOptions);
    }
    /**
     * Publish all assets in a manifest
     *
     * @deprecated Use `publishSingleAsset` instead
     */
    async publishAssets(asset, options) {
        const { manifest, stackEnv } = await this.prepareAndValidateAssets(asset, options);
        await publishAssets(manifest, this.sdkProvider, stackEnv, options.publishOptions);
    }
    /**
     * Build a single asset from an asset manifest
     */
    // eslint-disable-next-line max-len
    async buildSingleAsset(assetArtifact, assetManifest, asset, options) {
        const { resolvedEnvironment, envResources } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);
        await this.validateBootstrapStackVersion(options.stack.stackName, assetArtifact.requiresBootstrapStackVersion, assetArtifact.bootstrapStackVersionSsmParameter, envResources);
        const publisher = this.cachedPublisher(assetManifest, resolvedEnvironment, options.stackName);
        await publisher.buildEntry(asset);
    }
    /**
     * Publish a single asset from an asset manifest
     */
    // eslint-disable-next-line max-len
    async publishSingleAsset(assetManifest, asset, options) {
        const { resolvedEnvironment: stackEnv } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);
        // No need to validate anymore, we already did that during build
        const publisher = this.cachedPublisher(assetManifest, stackEnv, options.stackName);
        await publisher.publishEntry(asset);
    }
    /**
     * Return whether a single asset has been published already
     */
    async isSingleAssetPublished(assetManifest, asset, options) {
        const { resolvedEnvironment: stackEnv } = await this.prepareSdkFor(options.stack, options.roleArn, Mode.ForWriting);
        const publisher = this.cachedPublisher(assetManifest, stackEnv, options.stackName);
        return publisher.isEntryPublished(asset);
    }
    /**
     * Validate that the bootstrap stack has the right version for this stack
     *
     * Call into envResources.validateVersion, but prepend the stack name in case of failure.
     */
    async validateBootstrapStackVersion(stackName, requiresBootstrapStackVersion, bootstrapStackVersionSsmParameter, envResources) {
        try {
            await envResources.validateVersion(requiresBootstrapStackVersion, bootstrapStackVersionSsmParameter);
        }
        catch (e) {
            throw new Error(`${stackName}: ${e.message}`);
        }
    }
    async cachedSdkForEnvironment(environment, mode, options) {
        const cacheKey = [
            environment.account,
            environment.region,
            `${mode}`,
            options?.assumeRoleArn ?? "",
            options?.assumeRoleExternalId ?? "",
        ].join(":");
        const existing = this.sdkCache.get(cacheKey);
        if (existing) {
            return existing;
        }
        const ret = await this.sdkProvider.forEnvironment(environment, mode, options);
        this.sdkCache.set(cacheKey, ret);
        return ret;
    }
    cachedPublisher(assetManifest, env, stackName) {
        const existing = this.publisherCache.get(assetManifest);
        if (existing) {
            return existing;
        }
        const prefix = stackName ? `${stackName}: ` : "";
        const publisher = new cdk_assets.AssetPublishing(assetManifest, {
            aws: new PublishingAws(this.sdkProvider, env),
            progressListener: new ParallelSafeAssetProgress(prefix, this.props.quiet ?? false),
        });
        this.publisherCache.set(assetManifest, publisher);
        return publisher;
    }
}
/**
 * Asset progress that doesn't do anything with percentages (currently)
 */
class ParallelSafeAssetProgress {
    prefix;
    quiet;
    constructor(prefix, quiet) {
        this.prefix = prefix;
        this.quiet = quiet;
    }
    onPublishEvent(type, event) {
        const handler = this.quiet && type !== "fail" ? debug : EVENT_TO_LOGGER[type];
        handler(`${this.prefix} ${type}: ${event.message}`);
    }
}
/**
 * @deprecated Use 'Deployments' instead
 */
export class CloudFormationDeployments extends Deployments {
}
