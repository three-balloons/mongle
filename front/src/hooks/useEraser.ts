import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/curve/useCurve';
import { view2Point } from '@/util/coordSys/conversion';
import { curve2Rect } from '@/util/shapes/conversion';
import { isCollisionCapsuleWithCircle, isCollisionRectWithCircle } from '@/util/shapes/collision';
import { useConfigStore } from '@/store/configStore';
import { useBubble } from '@/objects/bubble/useBubble';
import { useBubbleGun } from '@/hooks/useBubbleGun';

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
    const { eraseConfig, setEraseMode } = useConfigStore((state) => state);
    const earseModeRef = useRef<EraseMode>(eraseConfig.mode);
    const earseRadiusRef = useRef<number>(eraseConfig.radius);
    const { getCurves, addCurve, removeCurve, removeCurvesWithPath } = useCurve();
    const { view2BubbleWithVector2D, getBubbles, removeBubble, getDescendantBubbles } = useBubble();
    const { identifyTouchRegion } = useBubbleGun();

    useEffect(() => {
        useConfigStore.subscribe(({ eraseConfig }) => {
            earseModeRef.current = eraseConfig.mode;
            earseRadiusRef.current = eraseConfig.radius;
        });
    }, []);

    const erase = useCallback((cameraView: ViewCoord, currentPosition: Vector2D) => {
        if (earseModeRef.current == 'area') eraseArea(cameraView, currentPosition);
        else if (earseModeRef.current == 'stroke') eraseStroke(cameraView, currentPosition);
        else eraseBubble(cameraView, currentPosition);
    }, []);

    const eraseArea = (cameraView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;

        const curveWithErasers = findIntersectCurves(
            getCurves().map((curve) => {
                const position = view2Point(currentPosition, cameraView);
                const pos = view2BubbleWithVector2D(position, cameraView, curve.path);
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

    const eraseStroke = (cameraView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;
        const curveWithErasers = findIntersectCurves(
            getCurves().map((curve) => {
                const position = view2Point(currentPosition, cameraView);
                const pos = view2BubbleWithVector2D(position, cameraView, curve.path);
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

    const eraseBubble = (cameraView: ViewCoord, currentPosition: Vector2D) => {
        const { region, bubble } = identifyTouchRegion(cameraView, currentPosition, getBubbles());
        if (region == 'inside') {
            // TODO 경고 창 띄우고 지우기
            setEraseMode('area');
            if (bubble) {
                console.log(bubble.path);
                removeCurvesWithPath(bubble.path);
                getDescendantBubbles(bubble.path).forEach((descendant) => {
                    removeCurvesWithPath(descendant.path);
                    removeBubble(descendant);
                });

                removeBubble(bubble);
            }

            console.log(getBubbles());
        }
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
