import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { getViewCoordinate } from '@/util/canvas/canvas';
import { curve2View } from '@/util/coordSys/conversion';
import { useViewStore } from '@/store/viewStore';
import { useDrawer } from '@/hooks/useDrawer';
import { useConfigStore } from '@/store/configStore';
import { useEraser } from '@/hooks/useEraser';

type UseCanvasProps = {
    width?: number;
    height?: number;
};

/**
 * store canvas infromation and command functions
 */
export const useCanvas = ({ width = 0, height = 0 }: UseCanvasProps = {}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setCanvasView } = useViewStore((state) => state);
    const modeRef = useRef<ControlMode>('move');
    const isEraseRef = useRef<boolean>(false);
    // const { mode } = useConfigStore((state) => state);
    const canvasViewRef = useRef<ViewCoord>({
        pos: {
            top: -height / 2,
            left: -width / 2,
            width: width,
            height: height,
        },
        size: {
            x: width,
            y: height,
        },
        path: '/',
    });
    const isPaintingRef = useRef(false);
    const canvasImageRef = useRef<ImageData | null>(null);
    const { viewPath, getCurves, applyPenConfig } = useCurve();

    // tools
    const { startDrawing, draw, finishDrawing } = useDrawer();
    const { eraseArea } = useEraser();
    useEffect(() => {
        setCanvasView(canvasViewRef.current);
        // Rerenders when canvas view changes
        useViewStore.subscribe(({ canvasView }) => {
            canvasViewRef.current = canvasView;
            renderer(getCurves());
        });

        useConfigStore.subscribe(({ mode }) => {
            modeRef.current = mode;
        });
    }, []);

    const touchDown = useCallback((event: MouseEvent | TouchEvent) => {
        if (canvasRef.current == undefined) return;
        const currentPosition = getViewCoordinate(event, canvasRef.current);
        if (currentPosition) {
            if (isPaintingRef.current == false && modeRef.current == 'draw') {
                isPaintingRef.current = true;
                startDrawing(currentPosition, canvasViewRef.current);
            } else if (isEraseRef.current == false && modeRef.current == 'erase') {
                event.preventDefault();
                event.stopPropagation();
                isEraseRef.current = true;
            }
        }
    }, []);

    const touch = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (canvasRef.current == undefined) return;
        const currentPosition = getViewCoordinate(event, canvasRef.current);
        if (currentPosition) {
            if (isPaintingRef.current && modeRef.current == 'draw') {
                draw(currentPosition, canvasViewRef.current, lineRenderer, curveRenderer);
            } else if (isEraseRef.current && modeRef.current == 'erase') {
                eraseArea(currentPosition, canvasViewRef.current);
                renderer(getCurves());
            }
        }
    }, []);

    const touchUp = useCallback(() => {
        if (isPaintingRef.current && modeRef.current == 'draw') {
            finishDrawing(canvasViewRef.current, curveRenderer);
            isPaintingRef.current = false;
        } else if (isEraseRef.current && modeRef.current == 'erase') isEraseRef.current = false;
    }, []);

    //renders
    // bezier curve 적용 전 - 픽셀 단위로 그리기
    const lineRenderer = (startPoint: Point, endPoint: Point) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            applyPenConfig(context);
            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
        }
    };

    // addControlPoint가 true일 때 실행
    const curveRenderer = (curve: Curve2D, splineCount: number, isForce: boolean = false): number | undefined => {
        if (!canvasRef.current) {
            return;
        }
        let splineCnt = splineCount;
        if (!isForce && splineCnt + 3 > Math.floor((curve.length - 1) / 3) * 3) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            if (canvasImageRef.current) context.putImageData(canvasImageRef.current, 0, 0);
            else context.clearRect(0, 0, canvas.width, canvas.height);
            applyPenConfig(context);
            const points = curve2View(curve, viewPath, canvasViewRef.current);
            context.beginPath();
            // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
            if (points.length > 0) {
                for (let i = 1; i < points.length; i += 3) {
                    context.moveTo(points[i - 1].x, points[i - 1].y);
                    if (points.length - i == 1) {
                        if (isForce) {
                            context.lineTo(points[i].x, points[i].y);
                            context.moveTo(points[i].x, points[i].y);
                            splineCnt = i;
                        }
                        break;
                    } else if (points.length - i == 2) {
                        if (isForce) {
                            context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
                            context.moveTo(points[i + 1].x, points[i + 1].y);
                            splineCnt = i + 1;
                        }
                        break;
                    } else if (splineCnt < i) {
                        context.bezierCurveTo(
                            points[i].x,
                            points[i].y,
                            points[i + 1].x,
                            points[i + 1].y,
                            points[i + 2].x,
                            points[i + 2].y,
                        );
                        context.moveTo(points[i + 2].x, points[i + 2].y);
                        splineCnt = i + 2;
                    }
                }
            }
            context.stroke();
            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImageRef.current = data;
            return splineCnt;
        }
    };

    const renderer = (curves: Array<Curve>) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            curves.forEach((curve) => {
                let splineCnt = 0;

                applyPenConfig(context, curve.config);
                const points = curve2View(curve.position, curve.path, canvasViewRef.current);
                context.beginPath();
                // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
                if (points.length > 0) {
                    for (let i = 1; i < points.length; i += 3) {
                        context.moveTo(points[i - 1].x, points[i - 1].y);
                        if (points.length - i == 1) {
                            context.lineTo(points[i].x, points[i].y);
                            context.moveTo(points[i].x, points[i].y);
                            splineCnt = i;
                            break;
                        } else if (points.length - i == 2) {
                            context.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
                            context.moveTo(points[i + 1].x, points[i + 1].y);
                            splineCnt = i + 1;
                            break;
                        } else if (splineCnt < i) {
                            context.bezierCurveTo(
                                points[i].x,
                                points[i].y,
                                points[i + 1].x,
                                points[i + 1].y,
                                points[i + 2].x,
                                points[i + 2].y,
                            );
                            context.moveTo(points[i + 2].x, points[i + 2].y);
                            splineCnt = i + 2;
                        }
                    }
                }
                context.stroke();
            });
            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImageRef.current = data;
        }
    };

    return { isEraseRef, modeRef, canvasRef, touchDown, touch, touchUp };
};
