import { useCanvas } from '@/hooks/useCanvas';
import { cn } from '@/util/cn';
import style from '@/components/workspace/workspace.module.css';
import { useEffect } from 'react';

type WorkspaceProps = {
    width: number;
    height: number;
};
export const Workspace = ({ width, height }: WorkspaceProps) => {
    // 캔버스 크기는 js로 관리, 캔버스가 화면 밖으로 넘어가지 않음을 보장해야 함

    const { canvasRef, startPaint, paint, exitPaint } = useCanvas();
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        canvas.addEventListener('mousemove', paint);
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);

        canvas.addEventListener('touchstart', startPaint);
        canvas.addEventListener('touchmove', paint);
        canvas.addEventListener('touchend', exitPaint);
        canvas.addEventListener('touchcancel', exitPaint);

        return () => {
            canvas.removeEventListener('mousedown', startPaint);
            canvas.removeEventListener('mousemove', paint);
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);

            canvas.removeEventListener('touchstart', startPaint);
            canvas.removeEventListener('touchmove', paint);
            canvas.removeEventListener('touchend', exitPaint);
            canvas.removeEventListener('touchcancel', exitPaint);
        };
    }, [startPaint, paint, exitPaint]);
    return (
        <div>
            <canvas ref={canvasRef} className={cn(style.workspaceContent)} width={width} height={height}></canvas>
        </div>
    );
};
