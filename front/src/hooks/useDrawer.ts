import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { bubble2Vector2D, getThicknessRatio, view2Point } from '@/util/coordSys/conversion';
import { useBubble } from '@/objects/useBubble';

// functions about pen drawing
// features: draw curve
export const useDrawer = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { getNewCurvePath, setNewCurvePath, addControlPoint, addNewCurve } = useCurve();
    const { findBubble, descendant2child } = useBubble();

    const startDrawing = useCallback((canvasView: ViewCoord, currentPosition: Vector2D, path: string | undefined) => {
        positionRef.current = currentPosition;
        // TODO
        setNewCurvePath(path ?? canvasView.path);
        let pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        if (pos != undefined) {
            const parentBubble = findBubble(getNewCurvePath());
            if (parentBubble) {
                const bubbleView = descendant2child(parentBubble, getNewCurvePath());
                pos = bubble2Vector2D(pos, bubbleView);
            }
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
                let currentPos = view2Point(
                    {
                        x: currentPosition.x,
                        y: currentPosition.y,
                    },
                    canvasView,
                );
                if (currentPos != undefined) {
                    const parentBubble = findBubble(getNewCurvePath());

                    if (parentBubble) {
                        const bubbleView = descendant2child(parentBubble, getNewCurvePath());
                        currentPos = bubble2Vector2D(currentPos, bubbleView);
                    }
                    if (addControlPoint({ ...currentPos, isVisible: true }, true))
                        lineRenderer(positionRef.current, currentPosition);
                }
            }
            positionRef.current = currentPosition;
        },
        [],
    );

    const finishDrawing = useCallback(
        (canvasView: ViewCoord) => {
            if (positionRef.current) {
                let pos = view2Point({ x: positionRef.current.x, y: positionRef.current.y }, canvasView);

                if (pos) {
                    const parentBubble = findBubble(getNewCurvePath());

                    if (parentBubble) {
                        const bubbleView = descendant2child(parentBubble, getNewCurvePath());
                        pos = bubble2Vector2D(pos, bubbleView);
                    }
                    addControlPoint({ ...pos, isVisible: true }, true);
                }
            }
            addNewCurve(getThicknessRatio(canvasView));
        },
        [addNewCurve],
    );

    return { startDrawing, draw, finishDrawing };
};
