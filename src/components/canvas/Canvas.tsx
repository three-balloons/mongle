import { cn } from '@/util/cn';
import style from '@/components/canvas/canvas.module.css';
import { useEffect } from 'react';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useTouch } from '@/hooks/useTouch';
import { CanvasCursor } from '@/components/canvasCursor/CanvasCursor';

type CanvasProps = {
    width: number;
    height: number;
    workspaceId: string;
};

export const Canvas = ({ width, height /*, workspaceId*/ }: CanvasProps) => {
    const { touchDown, touch, touchUp } = useTouch();
    const { mainLayerRef, creationLayerRef, movementLayerRef, interfaceLayerRef, reRender } = useRenderer();

    useEffect(() => {
        reRender();
    }, [width, height, reRender]);

    useEffect(() => {
        if (!interfaceLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = interfaceLayerRef.current;
        canvas.addEventListener('pointerdown', touchDown);
        canvas.addEventListener('pointermove', touch);
        canvas.addEventListener('pointerup', touchUp);
        canvas.addEventListener('pointercancel', touchUp);
        canvas.addEventListener('pointerout', touchUp);

        return () => {
            canvas.removeEventListener('pointerdown', touchDown);
            canvas.removeEventListener('pointermove', touch);
            canvas.removeEventListener('pointerup', touchUp);
            canvas.removeEventListener('pointercancel', touchUp);
            canvas.removeEventListener('pointerout', touchUp);
        };
    }, [touchDown, touch, touchUp, interfaceLayerRef]);

    return (
        <div>
            <CanvasCursor width={width} height={height}>
                <canvas ref={mainLayerRef} className={cn(style.backgroundLayer)} width={width} height={height}></canvas>
                <canvas ref={movementLayerRef} className={cn(style.subLayer)} width={width} height={height}></canvas>
                <canvas ref={creationLayerRef} className={cn(style.subLayer)} width={width} height={height}></canvas>
                <canvas ref={interfaceLayerRef} className={cn(style.topLayer)} width={width} height={height}></canvas>
            </CanvasCursor>
        </div>
    );
};
