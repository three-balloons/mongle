import { useCallback, useRef } from 'react';
// import { useViewStore } from '@/store/viewStore';
import { subVector2D } from '@/util/shapes/operator';
import { useCamera } from '@/objects/camera/useCamera';

//
//
/**
 * functions about movement
 * @returns
 * @function grab grab the point to move
 * @function drag move cameraView
 * @function release grab the point to stop
 * @function focus (TODO) focus on bubble
 */
export const useHand = () => {
    const startPositionRef = useRef<Vector2D | undefined>();
    const startViewPositionRef = useRef<Vector2D | undefined>();
    const moveIntensityRef = useRef<Vector2D>({ x: 0, y: 0 });
    const startViewSizeRef = useRef<Vector2D>({ x: 0, y: 0 });
    // const startDistance = useRef<number | undefined>();
    const { updateCameraView } = useCamera();

    const grab = useCallback((cameraView: ViewCoord, currentPosition: Vector2D) => {
        startPositionRef.current = { ...currentPosition };
        moveIntensityRef.current = {
            x: cameraView.pos.width / cameraView.size.x,
            y: cameraView.pos.height / cameraView.size.y,
        };
        startViewPositionRef.current = {
            x: cameraView.pos.left,
            y: cameraView.pos.top,
        };
        startViewSizeRef.current = {
            x: cameraView.pos.width,
            y: cameraView.pos.height,
        };
    }, []);

    const drag = useCallback(
        (cameraView: ViewCoord, position: Vector2D /*, second: Vector2D | undefined = undefined*/) => {
            if (startPositionRef.current == undefined || startViewPositionRef.current == undefined) return;
            const { x, y } = subVector2D(startPositionRef.current, position);

            updateCameraView({
                ...cameraView,
                pos: {
                    ...cameraView.pos,
                    left: startViewPositionRef.current.x + moveIntensityRef.current.x * x,
                    top: startViewPositionRef.current.y + moveIntensityRef.current.y * y,
                },
            });
        },
        [],
    );

    const release = useCallback(() => {
        startPositionRef.current = undefined;
    }, []);

    return { grab, drag, release };
};
