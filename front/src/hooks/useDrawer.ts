import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { getThicknessRatio, view2Point } from '@/util/coordSys/conversion';

// functions about pen drawing
// features: draw curve
export const useDrawer = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { setViewPath, addControlPoint, addNewCurve } = useCurve();

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
                if (currentPos != undefined && addControlPoint({ ...currentPos, isVisible: true }))
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
            addNewCurve(getThicknessRatio(canvasView));
        },
        [addNewCurve],
    );

    return { startDrawing, draw, finishDrawing };
};
