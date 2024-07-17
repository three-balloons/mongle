import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { getViewCoordinate } from '@/util/canvas/canvas';
import { curve2bubble, curve2View, descendant2child, getThicknessRatio, rect2View } from '@/util/coordSys/conversion';
import { useViewStore } from '@/store/viewStore';
import { useDrawer } from '@/hooks/useDrawer';
import { useConfigStore } from '@/store/configStore';
import { useEraser } from '@/hooks/useEraser';
import { catmullRom2Bezier } from '@/util/shapes/conversion';
import { mockedBubbles } from '@/mock/bubble';

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
    const { viewPath, getCurves, applyPenConfig, setThicknessWithRatio } = useCurve();

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
            console.log(getThicknessRatio(canvasViewRef.current));
            setThicknessWithRatio(context, getThicknessRatio(canvasViewRef.current));
            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
        }
    };

    // addControlPoint가 true일 때 실행
    const curveRenderer = (curve: Curve2D, splineCount: number): number | undefined => {
        if (!canvasRef.current) {
            return;
        }
        let splineCnt = splineCount;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            if (canvasImageRef.current) context.putImageData(canvasImageRef.current, 0, 0);
            else context.clearRect(0, 0, canvas.width, canvas.height);
            applyPenConfig(context);
            const beziers = catmullRom2Bezier(curve2View(curve, canvasViewRef.current));
            context.beginPath();
            // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
            if (beziers.length > 0) {
                for (let i = 0; i < beziers.length; i++) {
                    if (splineCnt >= i) continue;
                    context.moveTo(beziers[i].start.x, beziers[i].start.y);
                    context.bezierCurveTo(
                        beziers[i].cp1.x,
                        beziers[i].cp1.y,
                        beziers[i].cp2.x,
                        beziers[i].cp2.y,
                        beziers[i].end.x,
                        beziers[i].end.y,
                    );
                    splineCnt = i;
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
                applyPenConfig(context, curve.config);
                setThicknessWithRatio(context, getThicknessRatio(canvasViewRef.current));
                const beziers = catmullRom2Bezier(curve2View(curve.position, canvasViewRef.current));
                context.beginPath();
                // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
                if (beziers.length > 0) {
                    for (let i = 0; i < beziers.length; i++) {
                        context.moveTo(beziers[i].start.x, beziers[i].start.y);
                        context.bezierCurveTo(
                            beziers[i].cp1.x,
                            beziers[i].cp1.y,
                            beziers[i].cp2.x,
                            beziers[i].cp2.y,
                            beziers[i].end.x,
                            beziers[i].end.y,
                        );
                    }
                }
                context.stroke();
            });
            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImageRef.current = data;
        }
    };

    // bubble과 그 내부의 요소를 렌더링함
    const bubbleRender = (bubble: Bubble) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        const bubbleView = descendant2child(bubble, canvasViewRef.current.path);
        if (bubbleView == undefined) return;
        const rect: Rect = rect2View(
            {
                height: bubbleView.height,
                width: bubbleView.width,
                top: bubbleView.top,
                left: bubbleView.left,
            },
            canvasViewRef.current,
        );
        if (context) {
            context.beginPath(); // Start a new path
            context.strokeStyle = 'lightblue';
            context.setLineDash([10, 10]);
            context.strokeRect(rect.left, rect.top, rect.width, rect.height); // Render the path
            context.setLineDash([]);
            bubble.curves.forEach((curve) => {
                const c = curve2bubble(curve.position, bubbleView);
                const beziers = catmullRom2Bezier(curve2View(c, canvasViewRef.current));
                applyPenConfig(context, curve.config);
                context.beginPath();
                // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
                if (beziers.length > 0) {
                    for (let i = 0; i < beziers.length; i++) {
                        context.moveTo(beziers[i].start.x, beziers[i].start.y);
                        context.bezierCurveTo(
                            beziers[i].cp1.x,
                            beziers[i].cp1.y,
                            beziers[i].cp2.x,
                            beziers[i].cp2.y,
                            beziers[i].end.x,
                            beziers[i].end.y,
                        );
                    }
                }
                context.stroke();
            });
        }
    };

    // 테스트를 위한 렌더링
    const mockRender = () => {
        bubbleRender(mockedBubbles[1]);
    };

    return { isEraseRef, modeRef, canvasRef, touchDown, touch, touchUp, mockRender };
};
