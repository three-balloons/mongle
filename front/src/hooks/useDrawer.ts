import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { view2Point } from '@/util/coordSys/conversion';

/**
 * store canvas infromation and command functions
 */
export const useDrawer = () => {
    const positionRef = useRef<Point | undefined>();
    const splineCountRef = useRef(0); // n번째 이후부터 spline 반영 안한 점들
    const { setViewPath, getDrawingCurve, addControlPoint, addNewLine } = useCurve();

    const startDrawing = useCallback((currentPosition: Point, canvasView: ViewCoord) => {
        positionRef.current = currentPosition;
        setViewPath(canvasView.path);
        const point = view2Point(
            {
                path: canvasView.path,
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        if (point != undefined) addControlPoint(point, true);
    }, []);

    const draw = useCallback(
        (
            currentPosition: Point,
            canvasView: ViewCoord,
            lineRenderer: (startPoint: Point, endPoint: Point) => void,
            curveRenderer: (curve: Curve2D, splineCount: number, isForce?: boolean) => number | undefined,
        ) => {
            if (
                positionRef.current &&
                (positionRef.current.x != currentPosition.x || positionRef.current.y != currentPosition.y)
            ) {
                // DOTO::draw 정책 설정 - 화면에 나타난 bubble안에도 생성 가능 여부(현재는 불가)
                const currentPoint = view2Point(
                    {
                        path: canvasView.path,
                        x: currentPosition.x,
                        y: currentPosition.y,
                    },
                    canvasView,
                );
                if (currentPoint != undefined && addControlPoint(currentPoint)) {
                    splineCountRef.current = curveRenderer(getDrawingCurve(), splineCountRef.current) ?? 0;
                }
                if (!positionRef.current) return;
                lineRenderer(positionRef.current, currentPosition);
                positionRef.current = currentPosition;
            }
        },
        [],
    );

    const finishDrawing = useCallback(
        (
            canvasView: ViewCoord,
            curveRenderer: (curve: Curve2D, splineCount: number, isForce?: boolean) => number | undefined,
        ) => {
            if (positionRef.current) {
                const point = view2Point(
                    { path: canvasView.path, x: positionRef.current.x, y: positionRef.current.y },
                    canvasView,
                );
                if (point) addControlPoint(point, true);
            }
            curveRenderer(getDrawingCurve(), splineCountRef.current, true);
            splineCountRef.current = 0;
            addNewLine();
        },
        [addNewLine],
    );

    return { startDrawing, draw, finishDrawing };
};
