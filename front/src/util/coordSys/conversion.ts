// TODO: path를 고려할 것
// import { isCollisionPointWithRect } from '@/util/shapes/collision';
// import { findBubble } from '@/util/bubble/bubble';

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
export const point2View = (point: Point, canvasView: ViewCoord): Vector2D => {
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
            isVisible: point.isVisible,
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
export const view2Point = (point: Vector2D, canvasView: ViewCoord): Vector2D => {
    const { left, top, width, height } = canvasView.pos;
    const { x: canvasWidth, y: canvasHeight } = canvasView.size;
    return {
        x: (point.x * width) / canvasWidth + left,
        y: (point.y * height) / canvasHeight + top,
    };
};

export const view2Rect = (rect: Rect, canvasView: ViewCoord): Rect => {
    const { left, top, width, height } = canvasView.pos;
    const { x: canvasWidth, y: canvasHeight } = canvasView.size;
    const rectTop = (rect.top * height) / canvasHeight + top;
    const rectLeft = (rect.left * width) / canvasWidth + left;
    return {
        top: rectTop,
        left: rectLeft,
        height: ((rect.height + rect.top) * height) / canvasHeight + top - rectTop,
        width: ((rect.width + rect.left) * width) / canvasWidth + left - rectLeft,
    };
};

export const point2bubble = (point: Point, bubble: Bubble | undefined): Point => {
    if (bubble == undefined) return point;
    else
        return {
            isVisible: point.isVisible,
            y: (bubble.height * (100 + point.y)) / 200 + bubble.top,
            x: (bubble.width * (100 + point.x)) / 200 + bubble.left,
        };
};

export const curve2bubble = (curve: Curve2D, bubble: Bubble | undefined): Curve2D => {
    if (bubble == undefined) return curve;
    else
        return curve.map((point) => {
            return {
                isVisible: point.isVisible,
                x: (bubble.width * (100 + point.x)) / 200 + bubble.left,
                y: (bubble.height * (100 + point.y)) / 200 + bubble.top,
            };
        });
};

export const rect2bubble = (rect: Rect, bubble: Bubble | undefined): Rect => {
    if (bubble == undefined) return rect;
    else
        return {
            top: (bubble.height * (100 + rect.top)) / 200 + bubble.top,
            left: (bubble.width * (100 + rect.left)) / 200 + bubble.left,
            height: (bubble.height * rect.height) / 200,
            width: (bubble.width * rect.width) / 200,
        };
};

// rect과 bubble은 좌표계가 같음 => rect을 bubble의 좌표계 안으로 넣음
export const bubble2rect = (rect: Rect, bubble: Bubble | undefined): Rect => {
    if (bubble == undefined) return rect;
    else
        return {
            top: ((rect.top - bubble.top) * 200) / bubble.height - 100,
            left: ((rect.left - bubble.left) * 200) / bubble.width - 100,
            height: (rect.height * 200) / bubble.height,
            width: (rect.width * 200) / bubble.width,
        };
};

// bubble 안의 curves를 밖으로 뺌
// renaming
export const getCurvesPosInBubble = (bubble: Bubble): Array<Curve2D> => {
    return bubble.curves.map((curve) => {
        return curve.position.map((point) => {
            return {
                isVisible: point.isVisible,
                x: (bubble.width * point.x) / 200 + bubble.left,
                y: (bubble.height * point.y) / 200 + bubble.top,
            };
        });
    });
};

export const getThicknessRatio = (canvasView: ViewCoord) => {
    return canvasView.size.x / canvasView.pos.width;
};
