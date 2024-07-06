import { useCallback, useRef, useEffect } from 'react';
import { useCurve } from './useCurve';
import { usePenConfig } from './usePenConfig';

export const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const position = useRef<Point | undefined>();
    const isPainting = useRef(false);
    const canvasImage = useRef<ImageData | null>(null);
    const splineCount = useRef(0); // n번째 이후부터 spline 반영 안한 점들
    const { getDrawingCurve, addControlPoint, addNewLine } = useCurve({ sensitivity: 1 });
    const { applyConfig } = usePenConfig();

    const getCoordinates = (event: MouseEvent | TouchEvent): Point | undefined => {
        if (!canvasRef.current) {
            return undefined;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        if (event instanceof MouseEvent) {
            return {
                x: Math.round(event.offsetX),
                y: Math.round(event.offsetY),
            };
        } else {
            return {
                x: Math.round(event.touches[0].clientX - canvas.offsetLeft),
                y: Math.round(event.touches[0].clientY - canvas.offsetTop),
            };
        }
    };

    // bezier curve 적용 전 - 픽셀 단위로 그리기
    const drawLine = (originalPosition: Point, newPosition: Point) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            applyConfig(context);
            context.beginPath();
            context.moveTo(originalPosition.x, originalPosition.y);
            context.lineTo(newPosition.x, newPosition.y);
            context.stroke();
        }
    };

    const startPaint = useCallback((event: MouseEvent | TouchEvent) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            isPainting.current = true;
            position.current = coordinates;
            addControlPoint(coordinates, true);
        }
    }, []);

    const paint = useCallback(
        (event: MouseEvent | TouchEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (isPainting.current) {
                const newPosition = getCoordinates(event);
                if (
                    position.current &&
                    newPosition &&
                    (position.current.x != newPosition.x || position.current.y != newPosition.y)
                ) {
                    if (addControlPoint(newPosition)) {
                        _updateCanvas(getDrawingCurve());
                    }
                    drawLine(position.current, newPosition);
                    position.current = newPosition;
                }
            }
        },
        [isPainting.current, position.current],
    );

    const exitPaint = useCallback(() => {
        if (position.current) {
            addControlPoint(position.current, true);
        }
        _updateCanvas(getDrawingCurve(), true);
        splineCount.current = 0;
        addNewLine();
        isPainting.current = false;
    }, [addNewLine]);

    // addControlPoint가 true일 때 실행
    const _updateCanvas = (line: Curve, isForce: boolean = false) => {
        if (!canvasRef.current) {
            return;
        }
        console.log(line);
        let splineCnt = splineCount.current;
        if (!isForce && splineCnt + 3 > Math.floor((line.length - 1) / 3) * 3) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            // console.log(line);
            if (canvasImage.current) context.putImageData(canvasImage.current, 0, 0);
            else context.clearRect(0, 0, canvas.width, canvas.height);
            applyConfig(context);
            context.beginPath();
            if (line.length > 0) {
                for (let i = 1; i < line.length; i += 3) {
                    context.moveTo(line[i - 1].x, line[i - 1].y);
                    if (line.length - i == 1) {
                        if (isForce) {
                            context.lineTo(line[i].x, line[i].y);
                            context.moveTo(line[i].x, line[i].y);
                            splineCnt = i;
                        }
                        break;
                    } else if (isForce && line.length - i == 2) {
                        if (isForce) {
                            context.quadraticCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y);
                            context.moveTo(line[i + 1].x, line[i + 1].y);
                            splineCnt = i + 1;
                        }
                        break;
                    } else if (splineCnt < i) {
                        console.log(line[i], i, splineCnt);
                        context.bezierCurveTo(
                            line[i].x,
                            line[i].y,
                            line[i + 1].x,
                            line[i + 1].y,
                            line[i + 2].x,
                            line[i + 2].y,
                        );
                        context.moveTo(line[i + 2].x, line[i + 2].y);
                        splineCnt = i + 2;
                    }
                }
            }
            context.stroke();
            splineCount.current = splineCnt;
            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImage.current = data;
        }
    };

    return { canvasRef, startPaint, paint, exitPaint, _updateCanvas };
};
