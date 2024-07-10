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

    const { canvasRef, startDrawing, draw, finishDrawing } = useCanvas({ width, height });
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', finishDrawing);
        canvas.addEventListener('mouseleave', finishDrawing);

        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', finishDrawing);
        canvas.addEventListener('touchcancel', finishDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', finishDrawing);
            canvas.removeEventListener('mouseleave', finishDrawing);

            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', finishDrawing);
            canvas.removeEventListener('touchcancel', finishDrawing);
        };
    }, [startDrawing, draw, finishDrawing]);
    return (
        <>
            <canvas ref={canvasRef} className={cn(style.workspaceContent)} width={width} height={height}></canvas>
        </>
    );
};
