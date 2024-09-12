import { useRef } from 'react';

// TODO: useText로 옮기기
export const usePenConfig = () => {
    const textConfigRef = useRef<TextConfig>({
        font: 'serif',
        fontSize: 48,
        fontWeight: 'normal',
    });

    const applyTextConfig = (context: CanvasRenderingContext2D, options?: TextConfig) => {
        if (!options) options = textConfigRef.current;
        context.font = `${options.fontWeight} ${Math.floor(options.fontSize)}px ${options.font}`;
    };

    return {
        applyTextConfig,
    };
};
