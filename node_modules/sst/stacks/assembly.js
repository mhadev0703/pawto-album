export async function loadAssembly(from) {
    const { CloudAssembly } = await import("aws-cdk-lib/cx-api");
    return new CloudAssembly(from);
}
