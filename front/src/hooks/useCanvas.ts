import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/useCurve';
import { getSecondTouchCoordinate, getViewCoordinate } from '@/util/canvas/canvas';
import { curve2bubble, curve2View, descendant2child, getThicknessRatio, rect2View } from '@/util/coordSys/conversion';
import { useViewStore } from '@/store/viewStore';
import { useDrawer } from '@/hooks/useDrawer';
import { useConfigStore } from '@/store/configStore';
import { useEraser } from '@/hooks/useEraser';
import { catmullRom2Bezier } from '@/util/shapes/conversion';
import { mockedBubbles } from '@/mock/bubble';
import { useHand } from '@/hooks/useHand';
import { useBubbleGun } from '@/hooks/useBubbleGun';
import { useBubble } from '@/objects/useBubble';

type UseCanvasProps = {
    width?: number;
    height?: number;
};

/**
 * store canvas infromation and command functions
 */
export const useCanvas = ({ width = 0, height = 0 }: UseCanvasProps = {}) => {
    const mainLayerRef = useRef<HTMLCanvasElement>(null);
    const creationLayerRef = useRef<HTMLCanvasElement>(null); // 그릴때 사용하는 레이어
    const movementLayerRef = useRef<HTMLCanvasElement>(null); // 이동할때 쓰이는 레이어
    const { setCanvasView } = useViewStore((state) => state);
    const { mode } = useConfigStore((state) => state);
    const modeRef = useRef<ControlMode>(mode);
    const isEraseRef = useRef<boolean>(false);
    const isPaintingRef = useRef(false);
    const isMoveRef = useRef(false);
    const isCreateBubbleRef = useRef(false);

    const canvasViewRef = useRef<ViewCoord>({
        pos: {
            top: -Math.floor(height / 2),
            left: -Math.floor(width / 2),
            width: width,
            height: height,
        },
        size: {
            x: width,
            y: height,
        },
        path: '/',
    });

    const canvasImageRef = useRef<ImageData | null>(null);
    const { getCurves, removeCurve, applyPenConfig, setThicknessWithRatio } = useCurve();
    const { getCreatingBubble, getBubbles } = useBubble();

    // tools
    const { startDrawing, draw, finishDrawing } = useDrawer();
    const { erase } = useEraser();
    const { grab, drag, release } = useHand();
    const { startCreateBubble, createBubble, finishCreateBubble } = useBubbleGun();
    useEffect(() => {
        setCanvasView(canvasViewRef.current);
        // Rerenders when canvas view changes
        useViewStore.subscribe(({ canvasView }) => {
            canvasViewRef.current = canvasView;
            reRender();
        });

        useConfigStore.subscribe(({ mode }) => {
            modeRef.current = mode;
        });
    }, []);

    const reRender = () => {
        // TODO 좌표 보정하기
        if (creationLayerRef.current) clearLayerRenderer(creationLayerRef.current);
        renderer(getCurves());

        getBubbles().forEach((bubble) => {
            bubbleRender(bubble);
        });
    };

    const touchDown = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (mainLayerRef.current == undefined) return;
        const currentPosition = getViewCoordinate(event, mainLayerRef.current);
        if (currentPosition) {
            if (isPaintingRef.current == false && modeRef.current == 'draw') {
                isPaintingRef.current = true;
                startDrawing(canvasViewRef.current, currentPosition);
            } else if (isEraseRef.current == false && modeRef.current == 'erase') {
                isEraseRef.current = true;
            } else if (modeRef.current == 'move') {
                if (isMoveRef.current == false) {
                    isMoveRef.current = true;
                    grab(canvasViewRef.current, currentPosition);
                }
            } else if (modeRef.current == 'bubble') {
                if (isCreateBubbleRef.current == false) {
                    isCreateBubbleRef.current = true;
                    startCreateBubble(canvasViewRef.current, currentPosition);
                }
            }
        }
    }, []);

    const touch = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (mainLayerRef.current == undefined) return;
        const currentPosition = getViewCoordinate(event, mainLayerRef.current);
        if (currentPosition) {
            if (isMoveRef.current && modeRef.current == 'move') {
                const secondPosition = getSecondTouchCoordinate(event, mainLayerRef.current);
                drag(canvasViewRef.current, currentPosition, secondPosition);
            } else if (isPaintingRef.current && modeRef.current == 'draw') {
                draw(canvasViewRef.current, currentPosition, lineRenderer, curveRenderer);
            } else if (isEraseRef.current && modeRef.current == 'erase') {
                erase(canvasViewRef.current, currentPosition);
                reRender();
            } else if (isCreateBubbleRef.current && modeRef.current == 'bubble') {
                createBubble(canvasViewRef.current, currentPosition);
                rectRender(getCreatingBubble());
            }
        }
    }, []);

    const touchUp = useCallback(() => {
        if (isMoveRef.current && modeRef.current == 'move') {
            isMoveRef.current = false;
            release();
        } else if (isPaintingRef.current && modeRef.current == 'draw') {
            finishDrawing(canvasViewRef.current);
            reRender();
            isPaintingRef.current = false;
        } else if (isEraseRef.current && modeRef.current == 'erase') isEraseRef.current = false;
        else if (isCreateBubbleRef.current && modeRef.current == 'bubble') {
            isCreateBubbleRef.current = false;
            finishCreateBubble();
            reRender();
        }
    }, []);

    const clearLayerRenderer = (canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (mainLayerRef.current == canvas) {
                console.log('main layer!!!!!!!!!!');
                canvasImageRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const getMainLayerRef = () => {
        return mainLayerRef;
    };

    const getMovementLayer = () => {
        return movementLayerRef.current;
    };

    const getCreationLayer = () => {
        return creationLayerRef.current;
    };

    //renders
    // bezier curve 적용 전 - 픽셀 단위로 그리기
    const lineRenderer = (startPoint: Vector2D, endPoint: Vector2D) => {
        if (!creationLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = creationLayerRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            applyPenConfig(context);
            setThicknessWithRatio(context, getThicknessRatio(canvasViewRef.current));
            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
        }
    };

    // addControlPoint가 true일 때 실행
    const curveRenderer = (curve: Curve2D, splineCount: number): number | undefined => {
        if (!creationLayerRef.current) {
            return;
        }
        let splineCnt = splineCount;
        const canvas: HTMLCanvasElement = creationLayerRef.current;
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
                    if (beziers[i].start.isVisible)
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
        if (!mainLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = mainLayerRef.current;
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
                    let isSweep = true;
                    for (let i = 0; i < beziers.length; i++) {
                        context.moveTo(beziers[i].start.x, beziers[i].start.y);
                        if (beziers[i].start.isVisible) {
                            context.bezierCurveTo(
                                beziers[i].cp1.x,
                                beziers[i].cp1.y,
                                beziers[i].cp2.x,
                                beziers[i].cp2.y,
                                beziers[i].end.x,
                                beziers[i].end.y,
                            );
                            isSweep = false;
                        }
                    }
                    if (isSweep) removeCurve(curve);
                }
                context.stroke();
            });

            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImageRef.current = data;
        }
    };

    // usage: create bubble drag
    const rectRender = (rect: Rect) => {
        if (!creationLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = creationLayerRef.current;
        const context = canvas.getContext('2d');
        const _rect: Rect = rect2View(rect, canvasViewRef.current);
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath(); // Start a new path
            context.strokeStyle = 'lightblue';
            context.setLineDash([10, 10]);
            context.strokeRect(_rect.left, _rect.top, _rect.width, _rect.height); // Render the path
            context.setLineDash([]);
        }
    };

    // bubble과 그 내부의 요소를 렌더링함
    const bubbleRender = (bubble: Bubble) => {
        if (!mainLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = mainLayerRef.current;
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

    return {
        isEraseRef,
        modeRef,
        mainLayerRef,
        creationLayerRef,
        movementLayerRef,
        getMainLayerRef,
        getCreationLayer,
        getMovementLayer,
        clearLayerRenderer,
        reRender,
        touchDown,
        touch,
        touchUp,
        mockRender,
    };
};
