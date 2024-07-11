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

export const catmullRom2Bezier = (points: Curve2D) => {
    const result = [];
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        result.push({
            start: p1,
            cp1: { x: cp1x, y: cp1y },
            cp2: { x: cp2x, y: cp2y },
            end: p2,
        });
    }
    return result;
};
