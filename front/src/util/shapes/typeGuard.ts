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

export const isCircle = (obj: unknown): obj is Circle => {
    if (obj && isPoint((obj as Circle).center) && typeof (obj as Circle).radius === 'number') return true;
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

export const isCurve = (obj: unknown): obj is Curve => {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        typeof (obj as Curve).position === 'object' && // Curve2D 타입 확인
        typeof (obj as Curve).path === 'string' &&
        typeof (obj as Curve).config === 'object' && // PenConfig 타입 확인
        typeof (obj as Curve).isVisible === 'boolean' &&
        (typeof (obj as Curve).id === 'number' || (obj as Curve).id === undefined)
    );
};

export const isBubble = (obj: unknown): obj is Bubble => {
    return (
        isRect(obj) &&
        typeof (obj as Bubble).path === 'string' &&
        Array.isArray((obj as Bubble).curves) &&
        (obj as Bubble).curves.every(isCurve) &&
        Array.isArray((obj as Bubble).children) &&
        (obj as Bubble).children.every(isBubble) &&
        ((obj as Bubble).parent === undefined || isBubble((obj as Bubble).parent)) &&
        typeof (obj as Bubble).isBubblized === 'boolean' &&
        typeof (obj as Bubble).isVisible === 'boolean'
    );
};
