// TODO: path를 고려할 것
import { getPathDepth } from '@/util/path/path';
import { isCollisionPointWithRect } from '@/util/shapes/collision';

// TODO canvasPath와 canvasView 합치기
// return undefined value when point can't be seen
export const point2View = (point: RectCoord, canvasView: ViewCoord): Point | undefined => {
    const depth = getPathDepth(canvasView.path, point.path);
    if (depth == -1) return undefined;
    if (depth == 0) {
        if (!isCollisionPointWithRect(point, canvasView.pos)) return undefined;
        const { left, top, width, height } = canvasView.pos;
        const { x: canvasWidth, y: canvasHeight } = canvasView.size;
        return {
            x: ((point.x - left) * canvasWidth) / width,
            y: ((point.y - top) * canvasHeight) / height,
        };
    }
    // TODO: depth가 깊어지는 경우도 해결
    return {
        x: 1,
        y: 1,
    };
};

// return undefined value when point can't be seen
export const view2Point = (point: RectCoord, canvasView: ViewCoord): Point | undefined => {
    const depth = getPathDepth(canvasView.path, point.path);
    if (depth == -1) return undefined;
    if (depth == 0) {
        if (!isCollisionPointWithRect(point, { top: 0, left: 0, width: canvasView.size.x, height: canvasView.size.y }))
            return undefined;
        const { left, top, width, height } = canvasView.pos;
        const { x: canvasWidth, y: canvasHeight } = canvasView.size;
        return {
            x: (point.x * width) / canvasWidth + left,
            y: (point.y * height) / canvasHeight + top,
        };
    }
    // TODO: depth가 깊어지는 경우도 해결
    return {
        x: 1,
        y: 1,
    };
};

export const curve2View = (curve: Curve2D, curvePath: string, canvasView: ViewCoord): Curve2D => {
    const depth = getPathDepth(canvasView.path, curvePath);
    if (depth == undefined) return [];
    if (depth == 0) {
        const ret: Curve2D = curve.map((point) => {
            const { left, top, width, height } = canvasView.pos;
            const { x: canvasWidth, y: canvasHeight } = canvasView.size;
            return {
                x: ((point.x - left) * canvasWidth) / width,
                y: ((point.y - top) * canvasHeight) / height,
            };
        });
        return ret;
    }
    // TODO: depth가 깊어지는 경우도 해결
    return [];
};

export const getThicknessRatio = (canvasView: ViewCoord) => {
    return canvasView.size.x / canvasView.pos.width;
};
