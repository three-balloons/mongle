// TODO: path를 고려할 것
import { getParentPath, getPathDepth } from '@/util/path/path';
// import { isCollisionPointWithRect } from '@/util/shapes/collision';
import { findBubble } from '@/util/bubble/bubble';

// idea: forward kinematics
/** 좌표 변환 과정(obj의 로컬 좌표 -> view 좌표(canvas에 보이는 좌표))
 * 1. bubble
 *    bubble내의 obj의 로컬 좌표계를 한 단계 올림(bubble과 같은 path, bubble처럼 취급)
 *
 *    functions: point2bubble, curve2bubble
 *
 * 2. hierarchy
 *    canvas view의 path와 bubble의 path가 다를 경우 canvas view의 좌표계로 맞춤
 *    anti-aliasing 필요(ex. 3 depth 이상 차이 나는 경우 undifined)
 *
 *    functions: descendant2child
 *
 * 3. canvasView
 *    canvasView를 통해 실제 canvas에 표시할 수 있는 좌표계 구하기
 *    1, 2과정을 포함함
 *
 *    functions: point2View, curve2View, rect2View
 *
 */

// TODO canvasPath와 canvasView 합치기
// return undefined value when point can't be seen(nope)
export const point2View = (point: Point, canvasView: ViewCoord): Point => {
    // if (!isCollisionPointWithRect(point, canvasView.pos)) return undefined;
    const { left, top, width, height } = canvasView.pos;
    const { x: canvasWidth, y: canvasHeight } = canvasView.size;
    return {
        x: ((point.x - left) * canvasWidth) / width,
        y: ((point.y - top) * canvasHeight) / height,
    };
};

export const curve2View = (curve: Curve2D, canvasView: ViewCoord): Curve2D => {
    const ret: Curve2D = curve.map((point) => {
        const { left, top, width, height } = canvasView.pos;
        const { x: canvasWidth, y: canvasHeight } = canvasView.size;
        return {
            x: ((point.x - left) * canvasWidth) / width,
            y: ((point.y - top) * canvasHeight) / height,
        };
    });
    return ret;
};

export const rect2View = (rect: Rect, canvasView: ViewCoord): Rect => {
    const { left, top, width, height } = canvasView.pos;
    const { x: canvasWidth, y: canvasHeight } = canvasView.size;
    const rectTop = ((rect.top - top) * canvasHeight) / height;
    const rectLeft = ((rect.left - left) * canvasWidth) / width;
    const ret: Rect = {
        top: rectTop,
        left: rectLeft,
        height: ((rect.top + rect.height - top) * canvasHeight) / height - rectTop,
        width: ((rect.left + rect.width - left) * canvasWidth) / width - rectLeft,
    };
    return ret;
};

// return undefined value when point can't be seen(nope)
export const view2Point = (point: Point, canvasView: ViewCoord): Point | undefined => {
    // if (!isCollisionPointWithRect(point, { top: 0, left: 0, width: canvasView.size.x, height: canvasView.size.y }))
    //     return undefined;
    const { left, top, width, height } = canvasView.pos;
    const { x: canvasWidth, y: canvasHeight } = canvasView.size;
    return {
        x: (point.x * width) / canvasWidth + left,
        y: (point.y * height) / canvasHeight + top,
    };
};

// 자손버블좌표계에서 자식버블좌표계로 변환
// 사용처: 버블 이동, 내부의 요소를 canvasView로 변환하기 위한 사전 작업
// TODO: 최적화

export const descendant2child = (descendant: Bubble, parent: Bubble): Bubble | undefined => {
    const depth = getPathDepth(parent.path, descendant.path);
    if (depth == undefined) return undefined;
    if (depth == 0) return descendant; // depth가 0인 경우 자체가 존재하지 않음
    if (depth == 1)
        return descendant; // descendant is child
    else if (depth > 1) {
        const ret: Bubble = { ...descendant };
        for (let i = 1; i < depth; i++) {
            const path = getParentPath(ret.path);
            if (path == undefined) return undefined;
            const parent = findBubble(path);
            if (parent == undefined) return undefined;
            ret.path = path;
            ret.top = (parent.height * ret.top) / 200 + parent.top;
            ret.left = (parent.width * ret.left) / 200 + parent.left;
            ret.height = (parent.height * ret.height) / 200;
            ret.width = (parent.width * ret.width) / 200;
        }
        return ret;
    }
};

export const point2bubble = (point: Point, path: string) => {
    const bubble = findBubble(path);
    if (bubble == undefined) return point;
    else
        return {
            y: (bubble.height * point.y) / 200 + bubble.top,
            x: (bubble.width * point.x) / 200 + bubble.left,
        };
};

export const curve2bubble = (curve: Curve2D, path: string): Curve2D => {
    const bubble = findBubble(path);
    if (bubble == undefined) return curve;
    else
        return curve.map((point) => {
            return {
                x: (bubble.width * point.x) / 200 + bubble.left,
                y: (bubble.height * point.y) / 200 + bubble.top,
            };
        });
};

export const rect2bubble = (rect: Rect, path: string): Rect => {
    const bubble = findBubble(path);
    if (bubble == undefined) return rect;
    else
        return {
            top: (bubble.height * rect.top) / 200 + bubble.top,
            left: (bubble.width * rect.left) / 200 + bubble.left,
            height: (bubble.height * rect.height) / 200,
            width: (bubble.width * rect.width) / 200,
        };
};

// bubble 안의 curves를 밖으로 뺌
// renaming
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
