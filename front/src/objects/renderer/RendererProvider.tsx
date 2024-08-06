import { useBubble } from '@/objects/bubble/useBubble';
import { useCamera } from '@/objects/camera/useCamera';
import { useCurve } from '@/objects/curve/useCurve';
import { useLog } from '@/objects/log/useLog';
import { useConfigStore } from '@/store/configStore';
import { useViewStore } from '@/store/viewStore';
import { MINIMUN_RENDERED_BUBBLE_SIZE } from '@/util/constant';
import { bubble2globalWithCurve, curve2View, getThicknessRatio, rect2View } from '@/util/coordSys/conversion';
import { getThemeMainColor } from '@/util/getThemeStyle';
import { catmullRom2Bezier } from '@/util/shapes/conversion';
import { easeInOutCubic } from '@/util/transition/transtion';
import { createContext, useEffect, useRef } from 'react';

export type RendererContextProps = {
    getCameraView: () => ViewCoord;
    getMainLayer: () => HTMLCanvasElement | null;
    mainLayerRef: React.RefObject<HTMLCanvasElement>;
    creationLayerRef: React.RefObject<HTMLCanvasElement>;
    movementLayerRef: React.RefObject<HTMLCanvasElement>;
    bubbleTransitAnimation: (
        bubble: Bubble,
        startBubblePos: Vector2D,
        endBubblePos: Vector2D,
        duration?: number,
    ) => void;
    reRender: () => void;
    lineRenderer: (startPoint: Vector2D, endPoint: Vector2D) => void;
    curveRenderer: (curve: Curve2D) => void;
    renderer: (curves: Array<Curve>) => void;
    rectRender: (rect: Rect) => void;
    bubbleRender: (bubble: Bubble) => void;
    movementBubbleRender: () => void;
};

export const RendererContext = createContext<RendererContextProps | undefined>(undefined);

type RendererProviderProps = {
    children: React.ReactNode;
    theme?: Theme;
};

export const RendererProvider: React.FC<RendererProviderProps> = ({ children, theme = '하늘' }) => {
    const { isShowAnimation } = useConfigStore((state) => state);
    const { setMode } = useConfigStore((state) => state);
    const isShowAnimationRef = useRef<boolean>(isShowAnimation);
    const mainLayerRef = useRef<HTMLCanvasElement>(null);
    const creationLayerRef = useRef<HTMLCanvasElement>(null); // 그릴때 사용하는 레이어
    const movementLayerRef = useRef<HTMLCanvasElement>(null); // 이동할때 쓰이는 레이어

    const canvasImageRef = useRef<ImageData | null>(null);

    // use for animation
    const modeRef = useRef<ControlMode>('none');

    const { getNewCurvePath, getCurves, removeCurve, applyPenConfig, setThicknessWithRatio } = useCurve();
    const { getBubbles, findBubble, descendant2child, getRatioWithCamera } = useBubble();
    const { pushLog } = useLog();
    const { getCameraView } = useCamera();

    useEffect(() => {
        // Rerenders when canvas view changes
        useViewStore.subscribe(() => {
            reRender();
        });
        useConfigStore.subscribe(({ isShowAnimation, mode }) => {
            isShowAnimationRef.current = isShowAnimation;
            modeRef.current = mode;
        });
    }, []);

    const getMainLayer = () => {
        return mainLayerRef.current;
    };

    const bubbleTransitAnimation = (
        bubble: Bubble,
        startBubblePos: Vector2D,
        endBubblePos: Vector2D,
        duration: number = 500,
    ) => {
        let time = 0;
        const prevMode = modeRef.current;
        setMode('animate');
        const intervalId = setInterval(() => {
            const pos = easeInOutCubic(time / duration, startBubblePos, endBubblePos);
            bubble.top = pos.y;
            bubble.left = pos.x;
            movementBubbleRender();
            time += 30;
            if (time >= duration) {
                setMode(prevMode);
                clearInterval(intervalId);
            }
        }, 30);
    };

    const reRender = () => {
        // TODO 좌표 보정하기
        if (creationLayerRef.current) clearLayerRenderer(creationLayerRef.current);
        if (movementLayerRef.current) clearLayerRenderer(movementLayerRef.current);
        renderer(getCurves());

        movementBubbleRender();
        getBubbles().forEach((bubble) => {
            if (!bubble.isBubblized) {
                bubbleRender(bubble);
            }
        });
    };

    const clearLayerRenderer = (canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (mainLayerRef.current == canvas) {
                canvasImageRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
            }
        }
    };

    //renders
    //
    /**
     * bezier curve 적용 전 - 픽셀 단위로 그리기
     */
    const lineRenderer = (startPoint: Vector2D, endPoint: Vector2D) => {
        if (!creationLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = creationLayerRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            applyPenConfig(context);
            setThicknessWithRatio(context, getThicknessRatio(getCameraView()));
            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
        }
    };

    /**
     * addControlPoint가 true일 때 실행
     */
    const curveRenderer = (curve: Curve2D) => {
        if (!creationLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = creationLayerRef.current;
        const context = canvas.getContext('2d');
        const cameraView = getCameraView();
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            applyPenConfig(context);

            const parentBubble = findBubble(getNewCurvePath());
            let c = curve;
            if (parentBubble) {
                const bubbleView = descendant2child(parentBubble, cameraView.path);
                c = bubble2globalWithCurve(curve, bubbleView);
            }
            const beziers = catmullRom2Bezier(curve2View(c, cameraView));
            context.beginPath();
            // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
            if (beziers.length > 0) {
                for (let i = 0; i < beziers.length; i++) {
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
                }
            }
            context.stroke();
        }
    };

    const renderer = (curves: Array<Curve>) => {
        if (!mainLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = mainLayerRef.current;
        const context = canvas.getContext('2d');
        const cameraView = getCameraView();
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            // TODO 버블을 먼저 찾고 버블 안에서 커브 넣기
            curves.forEach((curve) => {
                if (!curve.isVisible) return;
                applyPenConfig(context, curve.config);
                setThicknessWithRatio(context, getThicknessRatio(cameraView));
                const parentBubble = findBubble(curve.path);
                let c = curve.position;
                if (parentBubble) {
                    const bubbleView = descendant2child(parentBubble, cameraView.path);
                    c = bubble2globalWithCurve(curve.position, bubbleView);
                    const ratio = getRatioWithCamera(parentBubble, cameraView);
                    if (ratio && ratio * cameraView.size.x < MINIMUN_RENDERED_BUBBLE_SIZE) {
                        return;
                    }
                }

                const beziers = catmullRom2Bezier(curve2View(c, cameraView));
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
                    // TODO sweep 로직 다른 곳으로 옮기기
                    if (isSweep) {
                        removeCurve(curve);
                        pushLog({ type: 'delete', object: curve });
                    }
                }
                context.stroke();
            });

            const data = context.getImageData(0, 0, canvas.width, canvas.height);
            canvasImageRef.current = data;
        }
    };

    /**
     * usage: create bubble drag
     */
    const rectRender = (rect: Rect) => {
        if (!creationLayerRef.current) return;
        const canvas: HTMLCanvasElement = creationLayerRef.current;
        const context = canvas.getContext('2d');
        const _rect: Rect = rect2View(rect, getCameraView());
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath(); // Start a new path
            context.lineWidth = 5;
            context.strokeStyle = getThemeMainColor(theme);
            context.setLineDash([10, 10]);
            context.strokeRect(_rect.left, _rect.top, _rect.width, _rect.height); // Render the path
            context.setLineDash([]);
        }
    };

    /**
     * bubble과 그 내부의 요소를 렌더링함
     */
    const bubbleRender = (bubble: Bubble) => {
        if (!bubble.isVisible) return;
        const cameraView = getCameraView();
        const ratio = getRatioWithCamera(bubble, cameraView);
        if (ratio && ratio * cameraView.size.x < MINIMUN_RENDERED_BUBBLE_SIZE) {
            return;
        }
        if (!mainLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = mainLayerRef.current;
        const context = canvas.getContext('2d');
        const bubbleView = descendant2child(bubble, cameraView.path);
        if (bubbleView == undefined) return;
        const rect: Rect = rect2View(
            {
                height: bubbleView.height,
                width: bubbleView.width,
                top: bubbleView.top,
                left: bubbleView.left,
            },
            cameraView,
        );
        if (context) {
            context.beginPath(); // Start a new path
            context.strokeStyle = getThemeMainColor(theme);
            context.lineWidth = 5;
            context.setLineDash([10, 10]);
            context.strokeRect(rect.left, rect.top, rect.width, rect.height); // Render the path
            context.setLineDash([]);
            setThicknessWithRatio(context, getThicknessRatio(cameraView));
            // bubble.curves.forEach((curve) => {
            //     const c = bubble2globalWithCurve(curve.position, bubbleView);
            //     const beziers = catmullRom2Bezier(curve2View(c, cameraViewRef.current));
            //     applyPenConfig(context, curve.config);
            //     context.beginPath();
            //     // TODO: 실제 커브를 그리는 부분과 그릴지 말지 결정하는 부분 분리 할 것
            //     if (beziers.length > 0) {
            //         for (let i = 0; i < beziers.length; i++) {
            //             context.moveTo(beziers[i].start.x, beziers[i].start.y);
            //             context.bezierCurveTo(
            //                 beziers[i].cp1.x,
            //                 beziers[i].cp1.y,
            //                 beziers[i].cp2.x,
            //                 beziers[i].cp2.y,
            //                 beziers[i].end.x,
            //                 beziers[i].end.y,
            //             );
            //         }
            //     }
            //     context.stroke();
            // });
        }
    };

    const movementBubbleRender = () => {
        // TODO : useBubble에 movement, 고정, 안보이는 버블 분리 (성능개선)
        const cameraView = getCameraView();
        if (!movementLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = movementLayerRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            getBubbles().forEach((bubble) => {
                if (!bubble.isBubblized || !bubble.isVisible) return;
                const ratio = getRatioWithCamera(bubble, cameraView);
                if (ratio && ratio * cameraView.size.x < MINIMUN_RENDERED_BUBBLE_SIZE) {
                    return;
                }
                const bubbleView = descendant2child(bubble, cameraView.path);
                if (bubbleView == undefined) return;
                const rect: Rect = rect2View(
                    {
                        height: bubbleView.height,
                        width: bubbleView.width,
                        top: bubbleView.top,
                        left: bubbleView.left,
                    },
                    cameraView,
                );
                const radiusX = rect.width / 2;
                const radiusY = rect.height / 2;
                const x = rect.width / 2 + rect.left;
                const y = rect.height / 2 + rect.top;
                context.strokeStyle = getThemeMainColor(theme);
                context.beginPath();
                context.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
                const gradient = context.createRadialGradient(
                    x - rect.width * 0.2,
                    y - rect.height * 0.2,
                    Math.min(radiusX, radiusY) * 0.2,
                    x,
                    y,
                    Math.max(radiusX, radiusY),
                );
                gradient.addColorStop(0, 'rgb(255, 255, 255)');
                gradient.addColorStop(0.5, getThemeMainColor(theme, 0.5));
                context.fillStyle = gradient;
                context.fill();
                context.strokeStyle = getThemeMainColor(theme);
                context.stroke();
            });
        }
    };

    return (
        <RendererContext.Provider
            value={{
                getCameraView,
                getMainLayer,
                mainLayerRef,
                creationLayerRef,
                movementLayerRef,
                bubbleTransitAnimation,
                reRender,
                lineRenderer,
                curveRenderer,
                renderer,
                rectRender,
                bubbleRender,
                movementBubbleRender,
            }}
        >
            {children}
        </RendererContext.Provider>
    );
};
