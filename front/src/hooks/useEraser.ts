import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { curve2View } from '@/util/coordSys/conversion';
import { curve2Rect } from '@/util/shapes/conversion';
import { isCollisionRectWithCircle } from '@/util/shapes/collision';

/**
 * store canvas infromation and command functions
 */
export const useEraser = () => {
    const positionRef = useRef<Point | undefined>();
    const { getCurves } = useCurve();

    // 임의의 상수값 지우개 크기 => 추후 config에서 받아오기
    const removeRadius = 5;

    const removeArea = useCallback((currentPosition: Point, canvasView: ViewCoord) => {
        positionRef.current = currentPosition;
        const circle: Circle = {
            center: currentPosition,
            radius: removeRadius,
        };

        findIntersectCurves(circle, getCurves(), canvasView);
    }, []);

    const findIntersectCurves = (circle: Circle, curves: Array<Curve>, canvasView: ViewCoord): Array<Curve> => {
        return curves.filter((curve) => {
            const rect = curve2Rect(curve2View(curve.position, curve.path, canvasView));
            if (rect) return isCollisionRectWithCircle(rect, circle);
            return false;
        });
    };

    return { removeArea };
};
