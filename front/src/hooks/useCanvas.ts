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
    const positionRef = useRef<Point | undefined>();
    const isPaintingRef = useRef(false);
    const canvasImageRef = useRef<ImageData | null>(null);
    const splineCountRef = useRef(0); // n번째 이후부터 spline 반영 안한 점들
    const { viewPath, setViewPath, getCurves, getDrawingCurve, addControlPoint, addNewLine } = useCurve({
        sensitivity: 1,
    });
    const { applyPenConfig } = usePenConfig();

    useEffect(() => {
        setCanvasView(canvasViewRef.current);
        // Rerenders when canvas view changes
        useViewStore.subscribe(({ canvasView }) => {
            canvasViewRef.current = canvasView;
            renderer(getCurves());
        });
    }, []);

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

    const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
        if (canvasRef.current == undefined) return;
        const currentPosition = getViewCoordinate(event, canvasRef.current);
        if (currentPosition) {
            isPaintingRef.current = true;
            positionRef.current = currentPosition;
            setViewPath(canvasViewRef.current.path);
            const point = view2Point(
                {
                    path: canvasViewRef.current.path,
                    x: currentPosition.x,
                    y: currentPosition.y,
                },
                canvasViewRef.current,
            );
            if (point != undefined) addControlPoint(point, true);
        }
    }, []);

    const draw = useCallback(
        (event: MouseEvent | TouchEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (canvasRef.current == undefined) return;
            if (isPaintingRef.current) {
                const currentPosition = getViewCoordinate(event, canvasRef.current);
                if (
                    positionRef.current &&
                    currentPosition &&
                    (positionRef.current.x != currentPosition.x || positionRef.current.y != currentPosition.y)
                ) {
                    // DOTO::draw 정책 설정 - 화면에 나타난 bubble안에도 생성 가능 여부(현재는 불가)
                    const currentPoint = view2Point(
                        {
                            path: canvasViewRef.current.path,
                            x: currentPosition.x,
                            y: currentPosition.y,
                        },
                        canvasViewRef.current,
                    );
                    if (currentPoint != undefined && addControlPoint(currentPoint)) {
                        curveRenderer(getDrawingCurve());
                    }
                    if (!positionRef.current) return;
                    lineRenderer(positionRef.current, currentPosition);
                    positionRef.current = currentPosition;
                }
            }
        },
        [isPaintingRef.current, positionRef.current],
    );

    const finishDrawing = useCallback(() => {
        if (positionRef.current) {
            const point = view2Point(
                { path: canvasViewRef.current.path, x: positionRef.current.x, y: positionRef.current.y },
                canvasViewRef.current,
            );
            if (point) addControlPoint(point, true);
        }
        curveRenderer(getDrawingCurve(), true);
        splineCountRef.current = 0;
        addNewLine();
        isPaintingRef.current = false;
    }, [addNewLine]);

    // addControlPoint가 true일 때 실행
    const curveRenderer = (curve: Curve2D, isForce: boolean = false) => {
        if (!canvasRef.current) {
            return;
        }
        let splineCnt = splineCountRef.current;
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
            splineCountRef.current = splineCnt;
            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImageRef.current = data;
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

    return { canvasRef, startDrawing, draw, finishDrawing };
};
