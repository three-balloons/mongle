import { useCallback, useRef } from 'react';
import { useViewStore } from '@/store/viewStore';
import { subVector2D } from '@/util/shapes/operator';

//
//
/**
 * functions about movement
 * @returns
 * @function grab grab the point to move
 * @function drag move cameraView
 * @function release grab the point to stop
 * @function zoom (TODO)zoom in/out cameraView
 * @function focus (TODO) focus on bubble
 */
export const useHand = () => {
    const startPositionRef = useRef<Vector2D | undefined>();
    const startViewPositionRef = useRef<Vector2D | undefined>();
    const moveIntensityRef = useRef<Vector2D>({ x: 0, y: 0 });
    const startViewSizeRef = useRef<Vector2D>({ x: 0, y: 0 });
    // const startDistance = useRef<number | undefined>();
    const { setCameraView } = useViewStore((state) => state);

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

    // const secondGrab = useCallback((disSquare: number | undefined = undefined) => {
    //     startDistance.current = disSquare;
    // }, []);

    const drag = useCallback(
        (cameraView: ViewCoord, position: Vector2D /*, second: Vector2D | undefined = undefined*/) => {
            if (startPositionRef.current == undefined || startViewPositionRef.current == undefined) return;
            const { x, y } = subVector2D(startPositionRef.current, position);

            setCameraView({
                ...cameraView,
                pos: {
                    ...cameraView.pos,
                    left: startViewPositionRef.current.x + moveIntensityRef.current.x * x,
                    top: startViewPositionRef.current.y + moveIntensityRef.current.y * y,
                },
            });
            // if (second != undefined && startDistance.current != undefined && startDistance.current != 0) {
            //     const intensity = Math.round((distanceSquare(position, second) * 100) / startDistance.current);
            //     setCameraView({
            //         ...cameraView,
            //         pos: {
            //             left: startViewPositionRef.current.x + (startViewSizeRef.current.x * intensity) / 100,
            //             top: startViewPositionRef.current.y + (startViewSizeRef.current.y * intensity) / 100,
            //             width: (startViewSizeRef.current.x * intensity) / 100,
            //             height: (startViewSizeRef.current.y * intensity) / 100,
            //         },
            //     });
            // }
        },
        [],
    );

    const release = useCallback(() => {
        startPositionRef.current = undefined;
    }, []);

    // const secondRelease = useCallback(() => {
    //     startDistance.current = undefined;
    // }, []);

    return { grab, drag, release };
};
