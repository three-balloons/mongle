import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { getThicknessRatio, view2Point } from '@/util/coordSys/conversion';
import { useBubble } from '@/objects/useBubble';

// functions about pen drawing
// features: draw curve
export const useDrawer = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { getNewCurvePath, setNewCurvePath, addControlPoint, addNewCurve, getCurves } = useCurve();
    const { view2BubbleWithVector2D } = useBubble();

    const startDrawing = useCallback((canvasView: ViewCoord, currentPosition: Vector2D, path: string | undefined) => {
        positionRef.current = currentPosition;
        setNewCurvePath(path ?? canvasView.path);
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        const position = view2BubbleWithVector2D(pos, canvasView, getNewCurvePath());
        addControlPoint({ ...position, isVisible: true }, true);
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
                const currentPos = view2Point(
                    {
                        x: currentPosition.x,
                        y: currentPosition.y,
                    },
                    canvasView,
                );

                const position = view2BubbleWithVector2D(currentPos, canvasView, getNewCurvePath());
                if (addControlPoint({ ...position, isVisible: true }, true))
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
                const position = view2BubbleWithVector2D(pos, canvasView, getNewCurvePath());
                addControlPoint({ ...position, isVisible: true }, true);
            }
            addNewCurve(getThicknessRatio(canvasView));
        },

        [addNewCurve],
    );

    return { startDrawing, draw, finishDrawing };
};
