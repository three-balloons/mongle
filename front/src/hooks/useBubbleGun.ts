import { useBubble } from '@/objects/useBubble';
import { view2Point } from '@/util/coordSys/conversion';
import { subVector2D } from '@/util/shapes/operator';
import { useCallback, useRef } from 'react';

export const useBubbleGun = () => {
    const startCreatePosRef = useRef<Vector2D | undefined>();
    const { updateCreatingBubble, addBubble, getCreatingBubble } = useBubble();
    const startCreateBubble = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        if (pos) startCreatePosRef.current = pos;
        //TODO bubble 안에 있는지 판단
    }, []);

    const createBubble = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        if (
            startCreatePosRef.current &&
            (startCreatePosRef.current.x != currentPosition.x || startCreatePosRef.current.y != currentPosition.y)
        ) {
            const currentPos = view2Point(
                {
                    x: currentPosition.x,
                    y: currentPosition.y,
                },
                canvasView,
            );
            const { x, y } = startCreatePosRef.current;
            if (currentPos)
                updateCreatingBubble({
                    top: Math.min(currentPos.y, y),
                    left: Math.min(currentPos.x, x),
                    height: Math.abs(currentPos.y - y),
                    width: Math.abs(currentPos.x - x),
                });
        }
    }, []);

    const finishCreateBubble = useCallback(() => {
        const bubble: Bubble = {
            ...getCreatingBubble(),
            path: '/',
            curves: [],
            children: [],
            parent: undefined,
        };
        addBubble(bubble);
    }, []);
    return { startCreateBubble, createBubble, finishCreateBubble };
};
