import { useCanvas } from '@/hooks/useCanvas';
import { useHand } from '@/hooks/useHand';
import { useBubble } from '@/objects/bubble/useBubble';
import { useCamera } from '@/objects/camera/useCamera';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useCallback, useRef } from 'react';
// import { useViewStore } from '@/store/viewStore';

type InputPoint = {
    type: string;
    clientX: number;
    clientY: number;
};

/**
 * touchState 관리
 * touchState에 의해 이동하는 경우, 이동 관련 함수 호출
 *
 */
export const useTouch = () => {
    const { setFocusBubblePath } = useBubble();
    const { getMainLayer, getCameraView } = useRenderer();
    const { updateCameraView } = useCamera();
    const { grab, drag, release } = useHand();
    const { setupAction, executeAction, terminateAction } = useCanvas();

    // 위치와 타입도 저장
    const currentPointersRef = useRef<Map<number, InputPoint>>(new Map());
    const initalPointersRef = useRef<Map<number, InputPoint>>(new Map());
    const previousPointerNumRef = useRef<number>(0);
    const touchStateRef = useRef<TouchState>('none');
    const zoomDistanceRef = useRef<number | null>(null); // zoom에 사용
    const zoomScaleRef = useRef<number>(1);

    // 두 손가락 사이의 거리를 계산하는 함수
    const calculateDistance = (touch1: InputPoint, touch2: InputPoint) => {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const touchDown = useCallback((event: PointerEvent) => {
        const mainLayer = getMainLayer();
        const currentInput: InputPoint = {
            type: event.pointerType,
            clientX: event.clientX,
            clientY: event.clientY,
        };
        currentPointersRef.current.set(event.pointerId, { ...currentInput });
        initalPointersRef.current.set(event.pointerId, currentInput);
        changeTouchStateAndMove();
        if (touchStateRef.current == 'pan') {
            const currentPointerEventList = Array.from(currentPointersRef.current.values());
            if (mainLayer) {
                const position = getViewCoordinate(currentPointerEventList[0], mainLayer);
                grab(getCameraView(), position);
            }
        }
        if (mainLayer && touchStateRef.current == 'command') {
            const currentPosition = getViewCoordinate(currentInput, mainLayer);
            setupAction(currentPosition);
        }
        previousPointerNumRef.current = currentPointersRef.current.size;
    }, []);

    const touch = useCallback((event: PointerEvent) => {
        const mainLayer = getMainLayer();
        const currentInput: InputPoint = {
            type: event.pointerType,
            clientX: event.clientX,
            clientY: event.clientY,
        };
        if (currentPointersRef.current.has(event.pointerId)) {
            currentPointersRef.current.set(event.pointerId, currentInput);
            changeTouchStateAndMove();
        }
        if (touchStateRef.current == 'pan') {
            if (mainLayer) {
                const position = getViewCoordinate(currentPointersRef.current.values().next().value, mainLayer);
                drag(getCameraView(), position);
            }
        }
        if (touchStateRef.current == 'zoom') {
            if (zoomDistanceRef.current == null) {
                const currentPointerEventList = Array.from(currentPointersRef.current.values());
                zoomDistanceRef.current = calculateDistance(currentPointerEventList[0], currentPointerEventList[1]);
            }
            zoom(zoomScaleRef.current * 50 - 50, false);
        }

        if (mainLayer && touchStateRef.current == 'command') {
            const currentPosition = getViewCoordinate(currentPointersRef.current.values().next().value, mainLayer);
            executeAction(currentPosition);
        }
        previousPointerNumRef.current = currentPointersRef.current.size;
    }, []);

    const touchUp = useCallback((event: PointerEvent) => {
        initalPointersRef.current.delete(event.pointerId);
        currentPointersRef.current.delete(event.pointerId);
        const previousTouchState = touchStateRef.current;
        changeTouchStateAndMove();
        if (touchStateRef.current == 'pan' && previousPointerNumRef.current == 2) {
            release();
            currentPointersRef.current.forEach((input, key) => initalPointersRef.current.set(key, input));
            changeTouchStateAndMove();
        }
        if (previousTouchState == 'pan' && touchStateRef.current != 'pan') {
            release();
        }
        if (previousTouchState == 'zoom' && touchStateRef.current == 'pan') {
            const mainLayer = getMainLayer();

            if (mainLayer) {
                const position = getViewCoordinate(currentPointersRef.current.values().next().value, mainLayer);
                grab(getCameraView(), position);
            }
        }

        if (previousTouchState == 'command' && touchStateRef.current != 'command') {
            if (touchStateRef.current == 'none') terminateAction(false);
            else terminateAction(true);
        }
        previousPointerNumRef.current = currentPointersRef.current.size;
    }, []);

    const getTouchState = () => {
        return touchStateRef.current;
    };

    // touch 상태 변경
    const changeTouchStateAndMove = () => {
        const initalPointerEventList = Array.from(initalPointersRef.current.values());
        const currentPointerEventList = Array.from(currentPointersRef.current.values());

        if (
            initalPointersRef.current.size !== currentPointersRef.current.size ||
            initalPointersRef.current.size > 2 ||
            initalPointersRef.current.size == 0
        )
            touchStateRef.current = 'none';
        else if (
            currentPointerEventList.find((e) => e.type === 'pen' || currentPointerEventList[0].type == 'mouse') !=
            undefined
        ) {
            touchStateRef.current = 'command';
        } else if (currentPointersRef.current.size == 1) {
            // 'touch'
            touchStateRef.current = 'pan';
        } else if (currentPointersRef.current.size == 2) {
            const initalDistance = calculateDistance(initalPointerEventList[0], initalPointerEventList[1]);
            const currentDistance = calculateDistance(currentPointerEventList[0], currentPointerEventList[1]);
            if (zoomDistanceRef.current) {
                const scale = currentDistance / zoomDistanceRef.current;
                const changedScale = currentDistance / initalDistance;
                zoomDistanceRef.current = currentDistance;
                if (0.8 <= changedScale && changedScale <= 1.2 && touchStateRef.current == 'pan') {
                    touchStateRef.current = 'pan';
                } else {
                    touchStateRef.current = 'zoom';
                }
                zoomScaleRef.current = scale;
            } else {
                zoomDistanceRef.current = currentDistance;
                touchStateRef.current = 'pan';
            }
        } else {
            touchStateRef.current = 'none';
        }

        if (touchStateRef.current != 'pan' && touchStateRef.current != 'zoom') zoomDistanceRef.current = null;
        console.log(touchStateRef.current);
    };

    const getViewCoordinate = (inputPoint: InputPoint, canvas: HTMLCanvasElement): Vector2D => {
        return {
            x: Math.round(inputPoint.clientX) - canvas.offsetLeft,
            y: Math.round(inputPoint.clientY) - canvas.offsetTop,
        };
    };

    const zoom = (intensity: number, showAnimation?: boolean) => {
        setFocusBubblePath(undefined);
        const cameraView = getCameraView();
        updateCameraView(
            {
                ...cameraView,
                pos: {
                    left: cameraView.pos.left + (cameraView.pos.width * intensity) / 200,
                    top: cameraView.pos.top + (cameraView.pos.height * intensity) / 200,
                    width: (cameraView.pos.width * (100 - intensity)) / 100,
                    height: (cameraView.pos.height * (100 - intensity)) / 100,
                },
            },
            showAnimation ? { ...cameraView } : undefined,
        );
    };

    return { touchDown, touch, touchUp, getTouchState };
};
