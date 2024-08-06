export const pathToList = (path: string): Array<string> => {
    if (path == '/') return [''];
    return path.split('/');
};

export const getPathDepth = (path: string): number => {
    const pathList = pathToList(path);
    return pathList.length - 1;
};

export const getPathDifferentDepth = (parentPath: string, childPath: string): number | undefined => {
    const parent = pathToList(parentPath);
    const child = pathToList(childPath);
    const len = Math.min(parent.length, child.length);
    for (let i = 0; i < len; i++) {
        if (parent[i] != child[i]) return undefined;
    }
    return child.length - parent.length;
};

export const getParentPath = (path: string): string | undefined => {
    if (path == '/') return undefined;
    const paths = path.split('/');
    const ret = paths.slice(0, -1).join('/');
    return ret == '' ? '/' : ret;
};
