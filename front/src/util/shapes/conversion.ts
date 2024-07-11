// return rectagle that surrounds the curve
export const curve2Rect = (points: Curve2D, offset: number = 0): Rect | undefined => {
    if (points.length == 0) return undefined;
    let top = points[0].y;
    let bottom = points[0].y;
    let left = points[0].x;
    let right = points[0].x;
    points.forEach((point) => {
        top = Math.min(top, point.y);
        bottom = Math.max(bottom, point.y);
        left = Math.min(left, point.x);
        right = Math.max(right, point.x);
    });
    return {
        top: top - offset,
        left: left - offset,
        width: right - left + 2 * offset,
        height: bottom - top + 2 * offset,
    };
};
