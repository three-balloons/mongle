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

/**
 * 공통조상의 경로를 리턴
 */
export const getLCAPath = (pathA: string, pathB: string): string => {
    const listA = pathToList(pathA);
    const listB = pathToList(pathB);
    const length = Math.min(listA.length, listB.length);
    const ret: Array<string> = [];
    for (let i = 0; i < length; i++) {
        if (listA[i] !== listB[i]) {
            return ret.join('/');
        } else {
            ret.push(listA[i]);
        }
    }
    return ret.join('/');
};
