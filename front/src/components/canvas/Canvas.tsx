import { useCanvas } from '@/hooks/useCanvas';
import { cn } from '@/util/cn';
import style from '@/components/canvas/canvas.module.css';
import { useEffect, useState } from 'react';
import { isCollisionPointWithRect } from '@/util/shapes/collision';
import { getViewCoordinate } from '@/util/canvas/canvas';
import { addVector2D } from '@/util/shapes/operator';
import { useEraser } from '@/hooks/useEraser';
import { useRenderer } from '@/objects/renderer/useRenderer';

type CanvasProps = {
    width: number;
    height: number;
};

export const Canvas = ({ width, height }: CanvasProps) => {
    const { isEraseRef, touchDown, touch, touchUp } = useCanvas();
    const { mainLayerRef, creationLayerRef, movementLayerRef, reRender } = useRenderer();
    const { earseRadiusRef } = useEraser();

    useEffect(() => {
        reRender();
    }, [width, height]);

    const [position, setPosition] = useState<Vector2D>({ x: 0, y: 0 });

    useEffect(() => {
        if (!mainLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = mainLayerRef.current;
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

    useEffect(() => {
        if (!mainLayerRef.current) return;
        const canvas: HTMLCanvasElement = mainLayerRef.current;
        const CanvasOffset: Vector2D = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop,
        };
        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if (!mainLayerRef.current) return;
            const pos: Vector2D = getViewCoordinate(event, mainLayerRef.current);
            if (
                pos &&
                isEraseRef.current &&
                isCollisionPointWithRect(pos, {
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                })
            ) {
                setPosition(addVector2D(pos, CanvasOffset));
            } else if (isEraseRef.current == false) {
                // rerendering
                setPosition({ x: 0, y: 0 });
            }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleMouseMove);

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('touchmove', handleMouseMove);
        };
    }, []);
    return (
        <div>
            <canvas ref={creationLayerRef} className={cn(style.backgroundLayer)} width={width} height={height}></canvas>
            <canvas ref={movementLayerRef} className={cn(style.subLayer)} width={width} height={height}></canvas>
            <canvas ref={mainLayerRef} className={cn(style.mainLayer)} width={width} height={height}></canvas>

            {isEraseRef.current && (
                <div
                    className={style.eraser}
                    style={{
                        left: position.x - earseRadiusRef.current,
                        top: position.y - earseRadiusRef.current,
                        width: `${earseRadiusRef.current * 2}px`,
                        height: `${earseRadiusRef.current * 2}px`,
                    }}
                ></div>
            )}
        </div>
    );
};
