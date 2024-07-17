export const isFunction = (value: unknown) => typeof value === 'function';

export const isPoint = (obj: unknown): obj is Point => {
    if (obj && typeof (obj as Point).x === 'number' && typeof (obj as Point).y === 'number') return true;
    return false;
};

export const isVector3D = (obj: unknown): obj is Vector3D => {
    if (
        obj &&
        typeof (obj as Vector3D).x === 'number' &&
        typeof (obj as Vector3D).y === 'number' &&
        typeof (obj as Vector3D).z === 'number'
    )
        return true;
    return false;
};

export const isRect = (obj: unknown): obj is Rect => {
    if (
        obj &&
        typeof (obj as Rect).left === 'number' &&
        typeof (obj as Rect).top === 'number' &&
        typeof (obj as Rect).width === 'number' &&
        typeof (obj as Rect).height === 'number'
    )
        return true;
    return false;
};

export const isCircle = (obj: unknown): obj is Circle => {
    if (obj && isPoint((obj as Circle).center) && typeof (obj as Circle).radius === 'number') return true;
    return false;
};
