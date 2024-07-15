// TODO: path를 고려할 것
import { getPathDepth } from '@/util/path/path';
import { isCollisionPointWithRect } from '@/util/shapes/collision';

// idea: forward kinematics
/** 좌표 변환 과정(obj의 로컬 좌표 -> view 좌표(canvas에 보이는 좌표))
 * 1. obj2bubble
 *    bubble내의 obj의 로컬 좌표계를 한 단계 올림(bubble과 같은 path)
 *
 * 2. hierarchy
 *    canvas view의 path와 bubble의 path가 다를 경우 canvas view의 좌표계로 맞춤
 *    anti-aliasing 필요(ex. 2 depth 이상 차이 나는 경우 undifined)
 *
 * 3. canvasView
 *    canvasView와 보정한
 */

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

export const getCurvesPosInBubble = (bubble: Bubble): Array<Curve2D> => {
    return bubble.curves.map((curve) => {
        return curve.position.map((point) => {
            return {
                x: (bubble.width * point.x) / 200 + bubble.left,
                y: (bubble.height * point.y) / 200 + bubble.top,
            };
        });
    });
};

export const getThicknessRatio = (canvasView: ViewCoord) => {
    return canvasView.size.x / canvasView.pos.width;
};
