import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { getThicknessRatio, view2Point } from '@/util/coordSys/conversion';

/**
 * store canvas infromation and command functions
 */
export const useDrawer = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const splineCountRef = useRef(-1); // n번째 이후부터 spline 반영 안한 점들
    const { setViewPath, getDrawingCurve, addControlPoint, addNewCurve } = useCurve();

    const startDrawing = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;
        setViewPath(canvasView.path);
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        if (pos != undefined) {
            addControlPoint({ ...pos, isVisible: true }, true);
        }
    }, []);

    const draw = useCallback(
        (
            canvasView: ViewCoord,
            currentPosition: Vector2D,
            lineRenderer: (startPoint: Vector2D, endPoint: Vector2D) => void,
            curveRenderer: (curve: Curve2D, splineCount: number) => number | undefined,
        ) => {
            if (
                positionRef.current &&
                (positionRef.current.x != currentPosition.x || positionRef.current.y != currentPosition.y)
            ) {
                // DOTO::draw 정책 설정 - 화면에 나타난 bubble안에도 생성 가능 여부(현재는 불가)
                const currentPos = view2Point(
                    {
                        x: currentPosition.x,
                        y: currentPosition.y,
                    },
                    canvasView,
                );
                if (currentPos != undefined && addControlPoint({ ...currentPos, isVisible: true })) {
                    splineCountRef.current = curveRenderer(getDrawingCurve(), splineCountRef.current) ?? -1;
                }
                lineRenderer(positionRef.current, currentPosition);
            }
            positionRef.current = currentPosition;
        },
        [],
    );

    const finishDrawing = useCallback(
        (canvasView: ViewCoord) => {
            if (positionRef.current) {
                const pos = view2Point({ x: positionRef.current.x, y: positionRef.current.y }, canvasView);
                if (pos) addControlPoint({ ...pos, isVisible: true }, true);
            }
            splineCountRef.current = -1;
            addNewCurve(getThicknessRatio(canvasView));
        },
        [addNewCurve],
    );

    return { startDrawing, draw, finishDrawing };
};
