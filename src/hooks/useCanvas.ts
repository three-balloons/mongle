import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/curve/useCurve';
import { getViewCoordinate } from '@/util/canvas/canvas';
import { useDrawer } from '@/hooks/useDrawer';
import { useConfigStore } from '@/store/configStore';
import { useEraser } from '@/hooks/useEraser';
import { useHand } from '@/hooks/useHand';
import { useBubbleGun } from '@/hooks/useBubbleGun';
import { useBubble } from '@/objects/bubble/useBubble';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useCamera } from '@/objects/camera/useCamera';
import { getSquaredDistance } from '@/util/shapes/operator';
import { useEditor } from '@/hooks/useEditor';

/**
 * store canvas infromation and command functions
 */
// control logic
export const useCanvas = () => {
    const { getMainLayer, getCameraView, reRender, curveRenderer, lineRenderer } = useRenderer();
    const { mode } = useConfigStore((state) => state);

    /* state variable */
    const modeRef = useRef<ControlMode>(mode);
    const isEraseRef = useRef<boolean>(false);
    const isZoomRef = useRef<boolean>(false);
    const isPaintingRef = useRef(false);
    const isMoveRef = useRef(false);
    const isCreateBubbleRef = useRef(false);
    const isMoveBubbleRef = useRef(false);
    const isEditRef = useRef(false);

    const { getNewCurve } = useCurve();
    const { setFocusBubblePath, identifyTouchRegion } = useBubble();

    /* tools */
    const { startDrawing, draw, finishDrawing, cancelDrawing } = useDrawer();
    const { startErase, erase, endErase, eraseBubble } = useEraser();
    const { grab, drag, release } = useHand();
    const { startEditing, editCurve, finishEditing } = useEditor();
    const {
        startCreateBubble,
        createBubble,
        finishCreateBubble,
        startMoveBubble,
        moveBubble,
        // identifyTouchRegion,
        bubblize,
        unbubblize,
        finishMoveBubble,
    } = useBubbleGun();

    const { updateCameraView } = useCamera();

    /** 두 손가락으로 줌 인/아웃 관련 코드 */
    const scale = useRef(1);
    const touchPointDistance = useRef<number | null>(null);

    // 두 손가락 사이의 거리를 계산하는 함수
    const calculateDistance = (touch1: React.Touch, touch2: React.Touch) => {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    /**
     * 두 손가락 터치 시작
     * TODO 함수명 변경
     */
    const handleTouchStart = (e: TouchEvent | MouseEvent) => {
        const mainLayer = getMainLayer();
        if (mainLayer == undefined) return;
        const currentPosition = getViewCoordinate(e, mainLayer);
        if (e instanceof TouchEvent && e.touches.length === 2) {
            isZoomRef.current = true;
            const distance = Math.sqrt(
                getSquaredDistance(
                    { x: e.touches[0].clientX, y: e.touches[0].clientY },
                    { x: e.touches[1].clientX, y: e.touches[1].clientY },
                ),
            );
            grab(getCameraView(), currentPosition);
            touchPointDistance.current = distance;
            isMoveRef.current = true;
        } else if (
            ((e instanceof TouchEvent && e.touches.length === 1) || e instanceof MouseEvent) &&
            modeRef.current === 'move'
        ) {
            isMoveRef.current = true;
            grab(getCameraView(), currentPosition);
        }
    };

    const handleTouchMove = (e: TouchEvent | MouseEvent) => {
        const mainLayer = getMainLayer();
        if (mainLayer == undefined) return;
        const currentPosition = getViewCoordinate(e, mainLayer);
        if (e instanceof TouchEvent && e.touches.length === 2 && touchPointDistance.current && isMoveRef.current) {
            const currentDistance = calculateDistance(e.touches[0], e.touches[1]);
            const scaleChange = currentDistance / touchPointDistance.current;
            touchPointDistance.current = currentDistance;
            scale.current = scaleChange;
            resizeView(scale.current * 50 - 50, false);
            if (0.99 <= scaleChange && scaleChange <= 1.01) drag(getCameraView(), currentPosition);
            else grab(getCameraView(), currentPosition); // TODO 임시로 위치 초기화 => useHand로직 바꿀 것
        } else if (
            ((e instanceof TouchEvent && e.touches.length === 1) || e instanceof MouseEvent) &&
            isMoveRef.current &&
            modeRef.current === 'move'
        ) {
            drag(getCameraView(), currentPosition);
        }
    };

    const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
        if (e instanceof TouchEvent && e.touches.length < 2) {
            touchPointDistance.current = null;
            if (isZoomRef.current && e.touches.length === 0) {
                isZoomRef.current = false; // TODO::이전 mode로 변경
                isMoveRef.current = false;
            }
        }
        if (
            ((e instanceof TouchEvent && e.touches.length === 1) || e instanceof MouseEvent) &&
            modeRef.current === 'move'
        ) {
            isMoveRef.current = false;
            release();
        }
    };

    const resizeView = (intensity: number, showAnimation?: boolean) => {
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

    useEffect(() => {
        useConfigStore.subscribe(({ mode }) => {
            modeRef.current = mode;
        });
    }, []);

    const touchDown = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        handleTouchStart(event);
        const mainLayer = getMainLayer();
        if (mainLayer == undefined) return;
        const currentPosition = getViewCoordinate(event, mainLayer);
        if (currentPosition) {
            const cameraView = getCameraView();
            if (isPaintingRef.current == false && modeRef.current == 'draw') {
                const { bubble } = identifyTouchRegion(cameraView, currentPosition);
                if (bubble === undefined) startDrawing(cameraView, currentPosition, '/');
                else startDrawing(cameraView, currentPosition, bubble.path);
                isPaintingRef.current = true;
            } else if (isEraseRef.current == false && modeRef.current == 'erase') {
                startErase(cameraView);
                isEraseRef.current = true;
            } else if (modeRef.current == 'bubble') {
                const { region, bubble } = identifyTouchRegion(cameraView, currentPosition);

                if (isCreateBubbleRef.current == false) {
                    if (region === 'name') {
                        if (bubble) {
                            eraseBubble(bubble);
                            reRender();
                        }
                    } else if (region === 'border') {
                        if (bubble) {
                            if (bubble.isBubblized === false) bubblize(bubble);
                            else unbubblize(bubble);
                        }
                        reRender();
                    } else {
                        if (region == 'inside' && bubble && bubble.isBubblized == true) {
                            isMoveBubbleRef.current = true;
                            startMoveBubble(getCameraView(), currentPosition, bubble);
                        } else {
                            isCreateBubbleRef.current = true;
                            startCreateBubble(getCameraView(), currentPosition, bubble?.path ?? '/');
                        }
                    }
                }
            } else if (modeRef.current == 'edit') {
                startEditing(cameraView, currentPosition);
                isEditRef.current = true;
            }
        }
    }, []);

    const touch = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        handleTouchMove(event);
        const mainLayer = getMainLayer();
        if (mainLayer == undefined) return;
        const currentPosition = getViewCoordinate(event, mainLayer);
        if (currentPosition) {
            if (isPaintingRef.current && modeRef.current == 'draw') {
                draw(getCameraView(), currentPosition, lineRenderer);
                curveRenderer(getNewCurve());
                if (isZoomRef.current) {
                    isPaintingRef.current = false;
                    cancelDrawing();
                }
            } else if (isEraseRef.current && modeRef.current == 'erase') {
                erase(getCameraView(), currentPosition);
                reRender();
                if (isZoomRef.current) {
                    isEraseRef.current = false;
                    endErase();
                }
            } else if (modeRef.current == 'bubble') {
                if (isMoveBubbleRef.current) {
                    moveBubble(getCameraView(), currentPosition);
                    reRender();
                    if (isZoomRef.current) {
                        isMoveBubbleRef.current = false;
                        // TODO Bubble 이동 초기화?
                    }
                }
                if (isCreateBubbleRef.current) {
                    createBubble(getCameraView(), currentPosition);
                    if (isZoomRef.current) {
                        isCreateBubbleRef.current = false;
                        // TODO Bubble 생성 초기화?
                    }
                }
            } else if (modeRef.current == 'edit') {
                editCurve(getCameraView(), currentPosition);
            }
        }
    }, []);

    const touchUp = useCallback((event: MouseEvent | TouchEvent) => {
        handleTouchEnd(event);
        if (isPaintingRef.current && modeRef.current == 'draw') {
            isPaintingRef.current = false;
            if (isZoomRef.current) cancelDrawing();
            else finishDrawing(getCameraView());
            reRender();
        } else if (isEraseRef.current && modeRef.current == 'erase') {
            endErase();
            isEraseRef.current = false;
            console.log(isEraseRef.current);
        } else if (modeRef.current == 'bubble') {
            if (isCreateBubbleRef.current) {
                isCreateBubbleRef.current = false;
                finishCreateBubble(getCameraView());
                reRender();
            }
            if (isMoveBubbleRef.current) {
                isMoveBubbleRef.current = false;
                finishMoveBubble(getCameraView());
                reRender();
            }
        } else if (modeRef.current == 'edit') {
            isEditRef.current = false;
            finishEditing(getCameraView());
            reRender();
        }
    }, []);

    return {
        isEraseRef,
        modeRef,
        touchDown,
        touch,
        touchUp,
    };
};
