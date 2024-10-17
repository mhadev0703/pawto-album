export async function diff(stack, oldTemplate) {
    const { diffTemplate, formatDifferences, TemplateDiff } = await import("@aws-cdk/cloudformation-diff");
    // Generate diff
    const diff = diffTemplate(oldTemplate, stack.template);
    if (diff.isEmpty) {
        return { count: 0 };
    }
    // Only display resource and output changes
    // @ts-ignore
    diff.iamChanges = { hasChanges: false };
    // @ts-ignore
    diff.securityGroupChanges = { hasChanges: false };
    // @ts-ignore
    diff.awsTemplateFormatVersion = false;
    // @ts-ignore
    diff.transform = false;
    // @ts-ignore
    diff.description = false;
    // @ts-ignore
    diff.parameters = { differenceCount: 0 };
    // @ts-ignore
    diff.metadata = { differenceCount: 0 };
    // @ts-ignore
    diff.mappings = { differenceCount: 0 };
    // @ts-ignore
    diff.conditions = { differenceCount: 0 };
    // @ts-ignore
    diff.unknown = { differenceCount: 0 };
    // Filter out SST internal diffs
    // @ts-ignore
    delete diff.outputs.diffs?.["SSTMetadata"];
    // Format diff
    const output = [];
    const stream = {
        write(chunk) {
            output.push(`   ${chunk}`);
        },
    };
    const pathMap = await buildLogicalToPathMap(stack);
    formatDifferences(stream, diff, pathMap);
    // Remove trailing newline
    while (true) {
        if (output[output.length - 1]?.match(/^\s*$/)) {
            output.pop();
        }
        else {
            break;
        }
    }
    return {
        count: diff.outputs.differenceCount + diff.resources.differenceCount,
        diff: output.join(""),
    };
}
async function buildLogicalToPathMap(stack) {
    const { ArtifactMetadataEntryType } = await import("@aws-cdk/cloud-assembly-schema");
    const map = {};
    for (const md of stack.findMetadataByType(ArtifactMetadataEntryType.LOGICAL_ID)) {
        map[md.data] = md.path;
    }
    return map;
}
