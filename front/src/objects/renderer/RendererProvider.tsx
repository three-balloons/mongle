import { useBubble } from '@/objects/bubble/useBubble';
import { useCurve } from '@/objects/curve/useCurve';
import { useViewStore } from '@/store/viewStore';
import { bubble2globalWithCurve, curve2View, getThicknessRatio, rect2View } from '@/util/coordSys/conversion';
import { getThemeMainColor } from '@/util/getThemeStyle';
import { catmullRom2Bezier } from '@/util/shapes/conversion';
import { createContext, useEffect, useRef } from 'react';

export type RendererContextProps = {
    getCameraView: () => ViewCoord;
    getMainLayer: () => HTMLCanvasElement | null;
    mainLayerRef: React.RefObject<HTMLCanvasElement>;
    creationLayerRef: React.RefObject<HTMLCanvasElement>;
    movementLayerRef: React.RefObject<HTMLCanvasElement>;
    reRender: () => void;
    lineRenderer: (startPoint: Vector2D, endPoint: Vector2D) => void;
    curveRenderer: (curve: Curve2D) => void;
    renderer: (curves: Array<Curve>) => void;
    rectRender: (rect: Rect) => void;
    bubbleRender: (bubble: Bubble) => void;
    movementBubbleRender: (bubble: Bubble) => void;
};

export const RendererContext = createContext<RendererContextProps | undefined>(undefined);

type RendererProviderProps = {
    children: React.ReactNode;
    height?: number;
    width?: number;
    theme?: Theme;
};

export const RendererProvider: React.FC<RendererProviderProps> = ({
    children,
    height = 0,
    width = 0,
    theme = '하늘',
}) => {
    const { setCameraView } = useViewStore((state) => state);
    const mainLayerRef = useRef<HTMLCanvasElement>(null);
    const creationLayerRef = useRef<HTMLCanvasElement>(null); // 그릴때 사용하는 레이어
    const movementLayerRef = useRef<HTMLCanvasElement>(null); // 이동할때 쓰이는 레이어

    const canvasImageRef = useRef<ImageData | null>(null);

    const { getNewCurvePath, getCurves, removeCurve, applyPenConfig, setThicknessWithRatio } = useCurve();
    const { getBubbles, findBubble, descendant2child } = useBubble();

    const cameraViewRef = useRef<ViewCoord>({
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

    useEffect(() => {
        setCameraView(cameraViewRef.current);
        // Rerenders when canvas view changes
        useViewStore.subscribe(({ cameraView }) => {
            cameraViewRef.current = cameraView;
            reRender();
        });
    }, []);

    const getCameraView = () => {
        return cameraViewRef.current;
    };

    const getMainLayer = () => {
        return mainLayerRef.current;
    };

    const reRender = () => {
        // TODO 좌표 보정하기
        if (creationLayerRef.current) clearLayerRenderer(creationLayerRef.current);
        if (movementLayerRef.current) clearLayerRenderer(movementLayerRef.current);
        renderer(getCurves());

        getBubbles().forEach((bubble) => {
            if (bubble.isBubblized) {
                movementBubbleRender(bubble);
            } else {
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
            setThicknessWithRatio(context, getThicknessRatio(cameraViewRef.current));
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

        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            applyPenConfig(context);
            const parentBubble = findBubble(getNewCurvePath());
            let c = curve;
            if (parentBubble) {
                const bubbleView = descendant2child(parentBubble, cameraViewRef.current.path);
                c = bubble2globalWithCurve(curve, bubbleView);
            }
            const beziers = catmullRom2Bezier(curve2View(c, cameraViewRef.current));
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
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            curves.forEach((curve) => {
                applyPenConfig(context, curve.config);
                setThicknessWithRatio(context, getThicknessRatio(cameraViewRef.current));
                const parentBubble = findBubble(curve.path);
                let c = curve.position;
                if (parentBubble) {
                    const bubbleView = descendant2child(parentBubble, cameraViewRef.current.path);
                    c = bubble2globalWithCurve(curve.position, bubbleView);
                }

                const beziers = catmullRom2Bezier(curve2View(c, cameraViewRef.current));
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

    /**
     * usage: create bubble drag
     */
    const rectRender = (rect: Rect) => {
        if (!creationLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = creationLayerRef.current;
        const context = canvas.getContext('2d');
        const _rect: Rect = rect2View(rect, cameraViewRef.current);
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath(); // Start a new path
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
        if (!mainLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = mainLayerRef.current;
        const context = canvas.getContext('2d');
        const bubbleView = descendant2child(bubble, cameraViewRef.current.path);
        if (bubbleView == undefined) return;
        const rect: Rect = rect2View(
            {
                height: bubbleView.height,
                width: bubbleView.width,
                top: bubbleView.top,
                left: bubbleView.left,
            },
            cameraViewRef.current,
        );
        if (context) {
            context.beginPath(); // Start a new path
            context.strokeStyle = getThemeMainColor(theme);
            context.setLineDash([10, 10]);
            context.strokeRect(rect.left, rect.top, rect.width, rect.height); // Render the path
            context.setLineDash([]);
            bubble.curves.forEach((curve) => {
                const c = bubble2globalWithCurve(curve.position, bubbleView);
                const beziers = catmullRom2Bezier(curve2View(c, cameraViewRef.current));
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

    const movementBubbleRender = (bubble: Bubble) => {
        if (!movementLayerRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = movementLayerRef.current;
        const context = canvas.getContext('2d');
        const bubbleView = descendant2child(bubble, cameraViewRef.current.path);
        if (bubbleView == undefined) return;
        const rect: Rect = rect2View(
            {
                height: bubbleView.height,
                width: bubbleView.width,
                top: bubbleView.top,
                left: bubbleView.left,
            },
            cameraViewRef.current,
        );
        if (context) {
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
            console.log(theme, getThemeMainColor(theme));
            gradient.addColorStop(0, 'rgb(255, 255, 255)');
            gradient.addColorStop(0.5, getThemeMainColor(theme, 0.5));
            context.fillStyle = gradient;
            context.fill();
            context.strokeStyle = getThemeMainColor(theme);
            context.stroke();
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
