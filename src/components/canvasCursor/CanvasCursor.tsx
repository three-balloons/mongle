import { useEffect, useRef, useState } from 'react';
import style from '@/components/canvasCursor/canvasCursor.module.css';
import { ReactComponent as PenIcon } from '@/assets/icon/pen.svg';
import { ReactComponent as EraserIcon } from '@/assets/icon/eraser.svg';
import { ReactComponent as MoveIcon } from '@/assets/icon/hand.svg';
import { ReactComponent as GrabIcon } from '@/assets/icon/grab.svg';
import { ReactComponent as EditIcon } from '@/assets/icon/select.svg';
import { ReactComponent as PlusIcon } from '@/assets/icon/plus.svg';
import { cn } from '@/util/cn';
import { useCursorStore } from '@/store/cursorStore';

type CanvasCursorProps = {
    width: number;
    height: number;
    children: React.ReactNode;
};

export const CanvasCursor = ({ width, height, children }: CanvasCursorProps) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const canvasLeftRef = useRef(0);
    const canvasTopRef = useRef(0);
    const cursor = useCursorStore((state) => state.cursor);

    const [isActive, setIsActive] = useState<boolean>(true);

    const onMouseMove = (event: PointerEvent) => {
        const { clientX: x, clientY: y } = event;

        setMousePosition({ x: x, y: y });

        if (x - canvasLeftRef.current < 0 || y - canvasTopRef.current < 0) {
            setIsActive(false);
        } else setIsActive(true);
    };

    useEffect(() => {
        setIsActive(true);

        document.addEventListener('pointermove', onMouseMove);
        return () => {
            setIsActive(false);

            document.removeEventListener('pointermove', onMouseMove);
        };
    }, []);

    useEffect(() => {
        canvasLeftRef.current = window.innerWidth - width;
        canvasTopRef.current = window.innerHeight - height;
    }, [width, height]);

    const { x, y } = mousePosition;

    return (
        <>
            {isActive && cursor === 'pen' && (
                <ins>
                    <PenIcon
                        className={cn(style.cursor, style.icon, style.pen)}
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                        }}
                    />
                </ins>
            )}
            {isActive && cursor === 'eraser' && (
                <ins>
                    <EraserIcon
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                        }}
                        className={cn(style.cursor, style.icon, style.eraser)}
                    />
                </ins>
            )}
            {isActive && cursor === 'move' && (
                <MoveIcon
                    style={{
                        left: `${x}px`,
                        top: `${y}px`,
                    }}
                    className={cn(style.icon, style.move, style.cursor)}
                />
            )}
            {isActive && cursor === 'grab' && (
                <GrabIcon
                    className={cn(style.cursor, style.icon, style.grab)}
                    style={{
                        left: `${x}px`,
                        top: `${y}px`,
                    }}
                />
            )}
            {isActive && cursor === 'edit' && (
                <EditIcon
                    className={cn(style.cursor, style.icon, style.edit)}
                    style={{
                        left: `${x}px`,
                        top: `${y}px`,
                    }}
                />
            )}
            {isActive && cursor === 'add' && (
                <PlusIcon
                    className={cn(style.cursor, style.icon, style.add)}
                    style={{
                        left: `${x}px`,
                        top: `${y}px`,
                    }}
                />
            )}
            {children}
        </>
    );
};
