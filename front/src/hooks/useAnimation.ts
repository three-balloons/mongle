import { useRenderer } from '@/objects/renderer/useRenderer';
import { useConfigStore } from '@/store/configStore';
import { useViewStore } from '@/store/viewStore';
import { easeInOutCubic } from '@/util/transition/transtion';
import { useEffect, useRef } from 'react';

/**
 * functions about animation
 * features:bubble pop, bubble insert, bubble move, bubble transition
 */
export const useAnimation = () => {
    const { setCameraView, cameraView } = useViewStore((state) => state);

    const { mode, setMode } = useConfigStore((state) => state);
    const cameraViewRef = useRef<ViewCoord>(cameraView);
    const modeRef = useRef<ControlMode>('none');

    useEffect(() => {
        useViewStore.subscribe(({ cameraView }) => {
            cameraViewRef.current = cameraView;
        });
    }, []);

    const viewTransitAnimation = (startViewPos: Rect, endViewPos: Rect, duration: number = 1000) => {
        let time = 0;
        modeRef.current = mode;
        setMode('animate');
        const intervalId = setInterval(() => {
            const pos = easeInOutCubic(time / duration, startViewPos, endViewPos);
            setCameraView({ ...cameraViewRef.current, pos: pos });
            time += 30;
            if (time >= duration) {
                setMode(modeRef.current);
                clearInterval(intervalId);
            }
        }, 30);
    };

    return {
        viewTransitAnimation,
    };
};
