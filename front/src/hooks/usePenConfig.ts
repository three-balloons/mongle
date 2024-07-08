import { useConfigStore } from '@/store/configStore';

export const usePenConfig = () => {
    const { penConfig } = useConfigStore((state) => state);
    // const [config, setConfig] = useState<PenConfig>({
    //     color: 'green',
    //     thickness: 3,
    //     alpha: 1,
    //     font: 'serif',
    // });

    const applyConfig = (context: CanvasRenderingContext2D, options: PenConfig = penConfig) => {
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
