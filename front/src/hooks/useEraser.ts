import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { view2Point } from '@/util/coordSys/conversion';
import { curve2Rect } from '@/util/shapes/conversion';
import { isCollisionCapsuleWithCircle, isCollisionRectWithCircle } from '@/util/shapes/collision';
import { useConfigStore } from '@/store/configStore';
import { useBubble } from '@/objects/useBubble';

//
// features:

type CurveAndEraser = {
    curve: Curve;
    eraser: Circle;
};

/**
 * eraser 좌표를 버블 좌표로 바꿔서 계산
 * functions about erasing
 * @function erase
 * @returns
 */
export const useEraser = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { eraseConfig } = useConfigStore((state) => state);
    const earseModeRef = useRef<EraseMode>(eraseConfig.mode);
    const earseRadiusRef = useRef<number>(eraseConfig.radius);
    const { getCurves, addCurve, removeCurve } = useCurve();
    const { view2BubbleWithVector2D } = useBubble();

    useEffect(() => {
        useConfigStore.subscribe(({ eraseConfig }) => {
            earseModeRef.current = eraseConfig.mode;
            earseRadiusRef.current = eraseConfig.radius;
        });
    }, []);

    const erase = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        if (earseModeRef.current == 'area') eraseArea(canvasView, currentPosition);
        else eraseStroke(canvasView, currentPosition);
    }, []);

    const eraseArea = (canvasView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;

        const curveWithErasers = findIntersectCurves(
            getCurves().map((curve) => {
                const position = view2Point(currentPosition, canvasView);
                const pos = view2BubbleWithVector2D(position, canvasView, curve.path);
                return {
                    curve: curve,
                    eraser: {
                        center: {
                            x: pos.x,
                            y: pos.y,
                        },
                        radius: earseRadiusRef.current,
                    },
                };
            }),
        );

        curveWithErasers.forEach(({ curve, eraser }) => {
            const temp = markCurveWithEraser(eraser, curve);
            removeCurve(curve);
            addCurve(temp);
        });
    };

    const eraseStroke = (canvasView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;
        const curveWithErasers = findIntersectCurves(
            getCurves().map((curve) => {
                const position = view2Point(currentPosition, canvasView);
                const pos = view2BubbleWithVector2D(position, canvasView, curve.path);
                return {
                    curve: curve,
                    eraser: {
                        center: {
                            x: pos.x,
                            y: pos.y,
                        },
                        radius: earseRadiusRef.current,
                    },
                };
            }),
        );
        curveWithErasers.forEach(({ curve, eraser }) => {
            if (isIntersectCurveWithEraser(eraser, curve)) removeCurve(curve);
        });
    };

    const findIntersectCurves = (curveWithErasers: Array<CurveAndEraser>): Array<CurveAndEraser> => {
        return curveWithErasers.filter(({ curve, eraser }) => {
            const rect = curve2Rect(curve.position);
            if (rect) return isCollisionRectWithCircle(rect, eraser);
            return false;
        });
    };

    const isIntersectCurveWithEraser = (circle: Circle, curve: Curve): boolean => {
        // TODO 두께 고려한 지우기, radius 보정 필요
        const points = curve.position;
        for (let i = 0; i < points.length - 1; i++) {
            if (isCollisionCapsuleWithCircle({ p1: points[i], p2: points[i + 1], radius: 5 }, circle)) {
                return true;
            }
        }
        return false;
    };

    /**
     * marked at control points which is invisible
     */
    const markCurveWithEraser = (circle: Circle, curve: Curve): Curve => {
        const { path, config } = curve;

        // TODO 두께 고려한 지우기, radius 보정 필요
        const points = curve.position;
        for (let i = 0; i < points.length - 1; i++) {
            if (isCollisionCapsuleWithCircle({ p1: points[i], p2: points[i + 1], radius: 5 }, circle)) {
                curve.position[i].isVisible = false;
            }
        }
        return {
            path: path,
            config: config,
            position: curve.position,
        };
    };

    return { erase, earseRadiusRef };
};
