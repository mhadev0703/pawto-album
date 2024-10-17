import type { BuildMetaConfig } from "astro-sst/build-meta";
type TreeNode = {
    branches: Record<string, TreeNode>;
    nodes: BuildMetaConfig["routes"][number][];
};
type FlattenedRoute = [string] | [string, 1] | [string, 2, string | undefined, number | undefined];
type FlattenedRouteTree = Array<FlattenedRoute | [string, FlattenedRouteTree]>;
export declare function flattenRouteTree(tree: TreeNode, parentKey?: string): FlattenedRouteTree;
export declare function getStringifiedRouteTree(routes: BuildMetaConfig["routes"]): string;
export {};
