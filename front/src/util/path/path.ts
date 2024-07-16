export const getPathDepth = (parentPath: string, childPath: string): number | undefined => {
    const parent = parentPath === '/' ? [''] : parentPath.split('/');
    const child = childPath === '/' ? [''] : childPath.split('/');
    let i;
    const len = Math.min(parent.length, child.length);
    for (i = 0; i < len; i++) {
        if (parent[i] !== child[i]) return undefined;
    }
    return child.length - parent.length;
};

export const getParentPath = (path: string): string | undefined => {
    if (path == '/') return undefined;
    const paths = path.split('/');
    return paths.slice(0, -1).join('/');
};
