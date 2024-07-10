import { useConfigStore } from '@/store/configStore';
import { useRef, useEffect } from 'react';

export const usePenConfig = () => {
    const penConfigRef = useRef<PenConfig>({
        color: 'black',
        thickness: 3,
        alpha: 1,
    });

    const textConfigRef = useRef<TextConfig>({
        font: 'serif',
        fontSize: 48,
        fontWeight: 'normal',
    });

    useEffect(() => {
        useConfigStore.subscribe(({ penConfig }) => {
            penConfigRef.current = penConfig;
        });
    }, []);

    const applyPenConfig = (context: CanvasRenderingContext2D, options?: PenConfig) => {
        if (!options) options = penConfigRef.current;
        context.strokeStyle = options.color as string;
        context.fillStyle = options.color as string;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = options.thickness;
        // context.font = `${config.fontWeight} ${Math.floor(config.fontSize)}px ${config.font}`;
        context.globalAlpha = options.alpha;
    };

    const applyTextConfig = (context: CanvasRenderingContext2D, options?: TextConfig) => {
        if (!options) options = textConfigRef.current;
        context.font = `${options.fontWeight} ${Math.floor(options.fontSize)}px ${options.font}`;
    };

    return {
        applyPenConfig,
        applyTextConfig,
    };
};
