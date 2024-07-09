import { useConfigStore } from '@/store/configStore';
import { useRef, useEffect } from 'react';

export const usePenConfig = () => {
    const penConfigRef = useRef<PenConfig>({
        color: 'black',
        thickness: 3,
        alpha: 1,
        font: 'serif',
    });

    useEffect(() => {
        useConfigStore.subscribe(({ penConfig }) => {
            penConfigRef.current = penConfig;
        });
    }, []);

    const applyConfig = (context: CanvasRenderingContext2D, options?: PenConfig) => {
        if (!options) options = penConfigRef.current;
        context.strokeStyle = options.color as string;
        context.fillStyle = options.color as string;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = options.thickness;
        // context.font = `${config.fontWeight} ${Math.floor(config.fontSize)}px ${config.font}`;
        context.globalAlpha = options.alpha;
    };

    return {
        applyConfig,
    };
};
