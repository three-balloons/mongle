import { useState } from 'react';

export const usePenConfig = () => {
    const [config, setConfig] = useState<PenConfig>({
        color: 'green',
        thickness: 3,
        alpha: 1,
        fontWeight: 'normal',
        font: 'serif',
        fontSize: 48,
    });

    const applyConfig = (context: CanvasRenderingContext2D) => {
        context.strokeStyle = config.color as string;
        context.fillStyle = config.color as string;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = config.thickness;
        context.font = `${config.fontWeight} ${Math.floor(config.fontSize)}px ${config.font}`;
        context.globalAlpha = config.alpha;
    };

    return {
        config,
        setConfig,
        applyConfig,
    };
};
