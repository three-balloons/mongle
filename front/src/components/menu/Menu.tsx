import { cn } from '@/util/cn';
import style from '@/components/menu/menu.module.css';
import { useViewStore } from '@/store/viewStore';
import { useConfigStore } from '@/store/configStore';

export const Menu = () => {
    const { canvasView, setCanvasView } = useViewStore((state) => state);
    const { setPenColor, setPenThickness } = useConfigStore((state) => state);
    return (
        <div className={cn(style.default)}>
            <div className={cn(style.config)}>
                <button className={cn(style.yellow)} onClick={() => setPenColor('yellow')}>
                    노란색
                </button>
                <button className={cn(style.black)} onClick={() => setPenColor('black')}>
                    검정색
                </button>
                <button className={cn(style.blue)} onClick={() => setPenThickness(7)}>
                    굵게
                </button>
                <button className={cn(style.blue)} onClick={() => setPenThickness(3)}>
                    중간 굵기
                </button>
                <button className={cn(style.blue)} onClick={() => setPenThickness(1)}>
                    얇게
                </button>
            </div>
            <div className={cn(style.config)}>
                <button
                    className={cn(style.green)}
                    onClick={() =>
                        setCanvasView({
                            ...canvasView,
                            pos: {
                                ...canvasView.pos,
                                left: canvasView.pos.left + 10,
                            },
                        })
                    }
                >
                    왼쪽 이동
                </button>
                <button
                    className={cn(style.green)}
                    onClick={() =>
                        setCanvasView({
                            ...canvasView,
                            pos: {
                                ...canvasView.pos,
                                left: canvasView.pos.left - 10,
                            },
                        })
                    }
                >
                    오른쪽 이동
                </button>
            </div>
        </div>
    );
};
