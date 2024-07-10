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

    const { canvasRef, touchDown, touch, touchUp } = useCanvas({ width, height });
    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', touchDown);
        canvas.addEventListener('mousemove', touch);
        canvas.addEventListener('mouseup', touchUp);
        canvas.addEventListener('mouseleave', touchUp);

        canvas.addEventListener('touchstart', touchDown);
        canvas.addEventListener('touchmove', touch);
        canvas.addEventListener('touchend', touchUp);
        canvas.addEventListener('touchcancel', touchUp);

        return () => {
            canvas.removeEventListener('mousedown', touchDown);
            canvas.removeEventListener('mousemove', touch);
            canvas.removeEventListener('mouseup', touchUp);
            canvas.removeEventListener('mouseleave', touchUp);
            canvas.removeEventListener('touchstart', touchDown);
            canvas.removeEventListener('touchmove', touch);
            canvas.removeEventListener('touchend', touchUp);
            canvas.removeEventListener('touchcancel', touchUp);
        };
    }, [touchDown, touch, touchUp]);
    return (
        <>
            <canvas ref={canvasRef} className={cn(style.workspaceContent)} width={width} height={height}></canvas>
        </>
    );
};
