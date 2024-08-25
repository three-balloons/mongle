import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/curve/useCurve';
import { getThicknessRatio, view2Point } from '@/util/coordSys/conversion';
import { useBubble } from '@/objects/bubble/useBubble';
import { useLog } from '@/objects/log/useLog';
import { useRenderer } from '@/objects/renderer/useRenderer';

// functions about pen drawing
// features: draw curve
export const useDrawer = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { getNewCurvePath, setNewCurvePath, addControlPoint, addNewCurve } = useCurve();
    const { view2BubbleWithVector2D, setFocusBubblePath } = useBubble();
    const { reRender } = useRenderer();

    /* logs */
    const { pushLog } = useLog();

    const startDrawing = useCallback((cameraView: ViewCoord, currentPosition: Vector2D, path: string | undefined) => {
        positionRef.current = currentPosition;
        setNewCurvePath(path ?? cameraView.path);
        setFocusBubblePath(path ?? cameraView.path);
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            cameraView,
        );
        const position = view2BubbleWithVector2D(pos, cameraView, getNewCurvePath());
        addControlPoint({ ...position, isVisible: true }, true);
        reRender();
    }, []);

    const draw = useCallback(
        (
            cameraView: ViewCoord,
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
                    cameraView,
                );

                const position = view2BubbleWithVector2D(currentPos, cameraView, getNewCurvePath());

                if (position.x < -100 || position.x > 100 || position.y < -100 || position.y > 100) {
                    return;
                }

                if (addControlPoint({ ...position, isVisible: true }))
                    lineRenderer(positionRef.current, currentPosition);
            }
            positionRef.current = currentPosition;
        },
        [],
    );

    const finishDrawing = useCallback(
        (cameraView: ViewCoord) => {
            if (positionRef.current) {
                const pos = view2Point({ x: positionRef.current.x, y: positionRef.current.y }, cameraView);
                const position = view2BubbleWithVector2D(pos, cameraView, getNewCurvePath());
                addControlPoint({ ...position, isVisible: true }, true);
            }
            const newCurve = addNewCurve(getThicknessRatio(cameraView));
            pushLog([{ type: 'create', object: newCurve, options: { path: getNewCurvePath() } }]);
        },

        [addNewCurve],
    );

    return { startDrawing, draw, finishDrawing };
};
