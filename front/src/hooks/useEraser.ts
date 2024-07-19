import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { curve2View } from '@/util/coordSys/conversion';
import { curve2Rect } from '@/util/shapes/conversion';
import { isCollisionRectWithCircle } from '@/util/shapes/collision';

export const useEraser = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { getCurves, addCurve, removeCurve } = useCurve();

    // 임의의 상수값 지우개 크기 => 추후 config에서 받아오기
    const removeRadius = 5;

    const eraseArea = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;
        const eraser: Circle = {
            center: { x: currentPosition.x, y: currentPosition.y },
            radius: removeRadius,
        };

        const curves = findIntersectCurves(eraser, getCurves(), canvasView);
        curves.forEach((curve) => {
            const temp = markCurveWithEraser(eraser, curve, canvasView);
            removeCurve(curve);
            addCurve(temp);
        });
    }, []);

    const findIntersectCurves = (circle: Circle, curves: Array<Curve>, canvasView: ViewCoord): Array<Curve> => {
        return curves.filter((curve) => {
            const rect = curve2Rect(curve2View(curve.position, canvasView));
            if (rect) return isCollisionRectWithCircle(rect, circle);
            return false;
        });
    };

    // marked at control points which is invisible
    const markCurveWithEraser = (circle: Circle, curve: Curve, canvasView: ViewCoord): Curve => {
        const { path, config } = curve;

        // TODO 두께 고려하기 & 타원충돌 고려하기
        const points = curve2View(curve.position, canvasView);
        for (let i = 0; i < points.length - 1; i++) {
            const rect = curve2Rect([points[i], points[i + 1]]);
            if (rect && isCollisionRectWithCircle(rect, circle)) {
                curve.position[i].isVisible = false;
            }
        }
        return {
            path: path,
            config: config,
            position: curve.position,
        };
    };

    return { eraseArea };
};
