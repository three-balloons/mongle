import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { curve2View } from '@/util/coordSys/conversion';
import { curve2Rect } from '@/util/shapes/conversion';
import { isCollisionRectWithCircle } from '@/util/shapes/collision';

export const useEraser = () => {
    const positionRef = useRef<Point | undefined>();
    const { getCurves, addCurves, removeCurve } = useCurve();

    // 임의의 상수값 지우개 크기 => 추후 config에서 받아오기
    const removeRadius = 5;

    const eraseArea = useCallback((canvasView: ViewCoord, currentPosition: Point) => {
        positionRef.current = currentPosition;
        const eraser: Circle = {
            center: currentPosition,
            radius: removeRadius,
        };

        const curves = findIntersectCurves(eraser, getCurves(), canvasView);
        curves.forEach((curve) => {
            const temp = seperateCurveWithEraser(eraser, curve, canvasView);
            if (temp.length > 0) {
                removeCurve(curve);
                addCurves(temp);
            }
        });
    }, []);

    const findIntersectCurves = (circle: Circle, curves: Array<Curve>, canvasView: ViewCoord): Array<Curve> => {
        return curves.filter((curve) => {
            const rect = curve2Rect(curve2View(curve.position, canvasView));
            if (rect) return isCollisionRectWithCircle(rect, circle);
            return false;
        });
    };

    const seperateCurveWithEraser = (circle: Circle, curve: Curve, canvasView: ViewCoord): Array<Curve> => {
        const { path, config } = curve;

        // 두께 고려하기 & 타원충돌 고려하기
        const points = curve2View(curve.position, canvasView);
        const ret: Array<Curve> = [];
        let continNum = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const rect = curve2Rect([points[i], points[i + 1]]);
            if (rect && isCollisionRectWithCircle(rect, circle)) {
                const insertedPoints: Curve2D = curve.position.slice(continNum, i + 1);
                if (insertedPoints.length > 0) {
                    ret.push({
                        path: path,
                        config: config,
                        position: insertedPoints,
                    });
                }

                continNum = i + 1;
            }
        }
        const insertedPoints: Curve2D = curve.position.slice(continNum);
        if (insertedPoints.length > 0)
            ret.push({
                path: path,
                config: config,
                position: insertedPoints,
            });
        return ret;
    };

    return { eraseArea };
};
