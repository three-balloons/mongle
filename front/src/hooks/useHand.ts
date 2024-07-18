import { useCallback, useRef } from 'react';
import { useViewStore } from '@/store/viewStore';
import { subPoint } from '@/util/shapes/operator';

export const useHand = () => {
    const startPositionRef = useRef<Point | undefined>();
    const startViewPositionRef = useRef<Point | undefined>();
    const moveIntensityRef = useRef<Vector2D>({ x: 0, y: 0 });
    const { setCanvasView } = useViewStore((state) => state);

    // 임의의 상수값 지우개 크기 => 추후 config에서 받아오기

    const grab = useCallback((currentPosition: Point, canvasView: ViewCoord) => {
        startPositionRef.current = { ...currentPosition };
        moveIntensityRef.current = {
            x: Math.round(canvasView.pos.width / canvasView.size.x),
            y: Math.round(canvasView.pos.height / canvasView.size.y),
        };
        startViewPositionRef.current = {
            x: Math.round(canvasView.pos.left),
            y: Math.round(canvasView.pos.top),
        };
    }, []);

    // action
    // change canvasView coordinate
    const drag = useCallback((position: Point, canvasView: ViewCoord) => {
        if (startPositionRef.current == undefined || startViewPositionRef.current == undefined) return;
        const { x, y } = subPoint(startPositionRef.current, position);
        setCanvasView({
            ...canvasView,
            pos: {
                ...canvasView.pos,
                left: startViewPositionRef.current.x + moveIntensityRef.current.x * x,
                top: startViewPositionRef.current.y + moveIntensityRef.current.y * y,
            },
        });
    }, []);

    return { grab, drag };
};
