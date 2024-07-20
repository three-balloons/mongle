import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { curve2View } from '@/util/coordSys/conversion';
import { curve2Rect } from '@/util/shapes/conversion';
import { isCollisionRectWithCircle } from '@/util/shapes/collision';
import { useConfigStore } from '@/store/configStore';

export const useEraser = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { eraseConfig } = useConfigStore((state) => state);
    const earseModeRef = useRef<EraseMode>(eraseConfig.mode);
    const earseRadiusRef = useRef<number>(eraseConfig.radius);
    const { getCurves, addCurve, removeCurve } = useCurve();

    useEffect(() => {
        useConfigStore.subscribe(({ eraseConfig }) => {
            earseModeRef.current = eraseConfig.mode;
            earseRadiusRef.current = eraseConfig.radius;
            console.log(earseRadiusRef.current);
        });
    }, []);

    // 임의의 상수값 지우개 크기 => 추후 config에서 받아오기
    // const removeRadius = 5;

    const erase = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        if (earseModeRef.current == 'area') eraseArea(canvasView, currentPosition);
        else eraseStroke(canvasView, currentPosition);
    }, []);

    const eraseArea = (canvasView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;
        const eraser: Circle = {
            center: { x: currentPosition.x, y: currentPosition.y },
            radius: earseRadiusRef.current,
        };

        const curves = findIntersectCurves(eraser, getCurves(), canvasView);
        curves.forEach((curve) => {
            const temp = markCurveWithEraser(eraser, curve, canvasView);
            removeCurve(curve);
            addCurve(temp);
        });
    };

    const eraseStroke = (canvasView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;
        const eraser: Circle = {
            center: { x: currentPosition.x, y: currentPosition.y },
            radius: earseRadiusRef.current,
        };

        const curves = findIntersectCurves(eraser, getCurves(), canvasView);
        curves.forEach((curve) => {
            if (isIntersectCurveWithEraser(eraser, curve, canvasView)) removeCurve(curve);
        });
    };

    const findIntersectCurves = (circle: Circle, curves: Array<Curve>, canvasView: ViewCoord): Array<Curve> => {
        return curves.filter((curve) => {
            const rect = curve2Rect(curve2View(curve.position, canvasView));
            if (rect) return isCollisionRectWithCircle(rect, circle);
            return false;
        });
    };

    // marked at control points which is invisible
    const isIntersectCurveWithEraser = (circle: Circle, curve: Curve, canvasView: ViewCoord): boolean => {
        // TODO 두께 고려한 지우기 & 타원충돌 고려하기
        // TODO bubbe layer를 고려한 좌표계 변환
        const points = curve2View(curve.position, canvasView);
        for (let i = 0; i < points.length - 1; i++) {
            const rect = curve2Rect([points[i], points[i + 1]]);
            if (rect && isCollisionRectWithCircle(rect, circle)) {
                return true;
            }
        }
        return false;
    };

    // marked at control points which is invisible
    const markCurveWithEraser = (circle: Circle, curve: Curve, canvasView: ViewCoord): Curve => {
        const { path, config } = curve;

        // TODO 두께 고려한 지우기 & 타원충돌 고려하기
        // TODO bubbe layer를 고려한 좌표계 변환
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

    return { erase, earseRadiusRef };
};
