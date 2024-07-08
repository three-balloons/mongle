export const getPathDepth = (parentPath: string, childPath: string): number | undefined => {
    const parent = parentPath.split('/');
    const child = childPath.split('/');
    let i;
    const len = Math.min(parent.length, child.length);
    for (i = 0; i < len; i++) {
        if (parent[i] !== child[i]) return undefined;
    }
    return child.length - parent.length;
};
