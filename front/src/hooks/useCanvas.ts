import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from './useCurve';
import { usePenConfig } from './usePenConfig';
import { getViewCoordinate } from '@/util/canvas/canvas';
import { curve2View, view2Point } from '@/util/coordSys/conversion';
import { useViewStore } from '@/store/viewStore';

type UseCanvasProps = {
    width?: number;
    height?: number;
};
export const useCanvas = ({ width = 0, height = 0 }: UseCanvasProps = {}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setCanvasView } = useViewStore((state) => state);
    const canvasViewRef = useRef<ViewCoordSys>({
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
    const position = useRef<Point | undefined>();
    const isPainting = useRef(false);
    const canvasImage = useRef<ImageData | null>(null);
    const splineCount = useRef(0); // n번째 이후부터 spline 반영 안한 점들
    const { currentPath, setPath, getCurve, getDrawingCurve, addControlPoint, addNewLine } = useCurve({
        sensitivity: 1,
    });
    const { applyConfig } = usePenConfig();

    useEffect(() => {
        setCanvasView(canvasViewRef.current);
        useViewStore.subscribe(({ canvasView }) => {
            canvasViewRef.current = canvasView;
            reDrawAllCurve(getCurve());
        });
    }, []);

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
        if (canvasRef.current == undefined) return;
        const coordinates = getViewCoordinate(event, canvasRef.current);
        if (coordinates) {
            isPainting.current = true;
            position.current = coordinates;
            setPath(canvasViewRef.current.path);
            const point = view2Point(
                {
                    path: canvasViewRef.current.path,
                    x: coordinates.x,
                    y: coordinates.y,
                },
                canvasViewRef.current,
            );
            if (point != undefined) addControlPoint(point, true);
        }
    }, []);

    const paint = useCallback(
        (event: MouseEvent | TouchEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (canvasRef.current == undefined) return;
            if (isPainting.current) {
                const newPosition = getViewCoordinate(event, canvasRef.current);
                if (
                    position.current &&
                    newPosition &&
                    (position.current.x != newPosition.x || position.current.y != newPosition.y)
                ) {
                    // DOTO::renaming
                    // draw 정책 설정 - 화면에 나타난 bubble안에도 생성 가능 여부(현재는 불가)
                    const newPoint = view2Point(
                        {
                            path: canvasViewRef.current.path,
                            x: newPosition.x,
                            y: newPosition.y,
                        },
                        canvasViewRef.current,
                    );
                    if (newPoint != undefined && addControlPoint(newPoint)) {
                        updateCanvas(getDrawingCurve());
                    }
                    if (!position.current) return;
                    drawLine(position.current, newPosition);
                    position.current = newPosition;
                }
            }
        },
        [isPainting.current, position.current],
    );

    const exitPaint = useCallback(() => {
        if (position.current) {
            const point = view2Point(
                { path: canvasViewRef.current.path, x: position.current.x, y: position.current.y },
                canvasViewRef.current,
            );
            if (point) addControlPoint(point, true);
        }
        updateCanvas(getDrawingCurve(), true);
        splineCount.current = 0;
        addNewLine();
        isPainting.current = false;
    }, [addNewLine]);

    // addControlPoint가 true일 때 실행
    const updateCanvas = (curve: Curve2D, isForce: boolean = false) => {
        if (!canvasRef.current) {
            return;
        }
        let splineCnt = splineCount.current;
        if (!isForce && splineCnt + 3 > Math.floor((curve.length - 1) / 3) * 3) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            if (canvasImage.current) context.putImageData(canvasImage.current, 0, 0);
            else context.clearRect(0, 0, canvas.width, canvas.height);
            applyConfig(context);
            const line = curve2View(curve, currentPath, canvasViewRef.current);
            context.beginPath();
            // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
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
                    } else if (line.length - i == 2) {
                        if (isForce) {
                            context.quadraticCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y);
                            context.moveTo(line[i + 1].x, line[i + 1].y);
                            splineCnt = i + 1;
                        }
                        break;
                    } else if (splineCnt < i) {
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

    const reDrawAllCurve = (curves: Array<Curve>) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            curves.forEach((curve) => {
                let splineCnt = 0;

                applyConfig(context, curve.config);
                const line = curve2View(curve.position, curve.path, canvasViewRef.current);
                context.beginPath();
                // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
                if (line.length > 0) {
                    for (let i = 1; i < line.length; i += 3) {
                        context.moveTo(line[i - 1].x, line[i - 1].y);
                        if (line.length - i == 1) {
                            context.lineTo(line[i].x, line[i].y);
                            context.moveTo(line[i].x, line[i].y);
                            splineCnt = i;
                            break;
                        } else if (line.length - i == 2) {
                            context.quadraticCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y);
                            context.moveTo(line[i + 1].x, line[i + 1].y);
                            splineCnt = i + 1;
                            break;
                        } else if (splineCnt < i) {
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
            });
            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImage.current = data;
        }
    };

    return { canvasRef, startPaint, paint, exitPaint, updateCanvas };
};
