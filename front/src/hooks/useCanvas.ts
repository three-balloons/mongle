import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/curve/useCurve';
import { /*getSecondTouchCoordinate,*/ getViewCoordinate } from '@/util/canvas/canvas';
import { useDrawer } from '@/hooks/useDrawer';
import { useConfigStore } from '@/store/configStore';
import { useEraser } from '@/hooks/useEraser';
import { useHand } from '@/hooks/useHand';
import { useBubbleGun } from '@/hooks/useBubbleGun';
import { useBubble } from '@/objects/bubble/useBubble';
import { useRenderer } from '@/objects/renderer/useRenderer';

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
    const isPaintingRef = useRef(false);
    const isMoveRef = useRef(false);
    const isCreateBubbleRef = useRef(false);
    const isMoveBubbleRef = useRef(false);

    const { getDrawingCurve } = useCurve();
    const { getBubbles, descendant2child } = useBubble();

    /* tools */
    const { startDrawing, draw, finishDrawing } = useDrawer();
    const { startErase, erase, endErase } = useEraser();
    const { grab, drag, release } = useHand();
    const {
        startCreateBubble,
        createBubble,
        finishCreateBubble,
        startMoveBubble,
        moveBubble,
        identifyTouchRegion,
        bubblize,
        unbubblize,
        finishMoveBubble,
    } = useBubbleGun();

    useEffect(() => {
        useConfigStore.subscribe(({ mode }) => {
            modeRef.current = mode;
        });
    }, []);

    const touchDown = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const mainLayer = getMainLayer();
        if (mainLayer == undefined) return;
        const currentPosition = getViewCoordinate(event, mainLayer);
        if (currentPosition) {
            const cameraView = getCameraView();
            if (isPaintingRef.current == false && modeRef.current == 'draw') {
                const { bubble } = identifyTouchRegion(cameraView, currentPosition, getBubbles());
                if (bubble === undefined) console.error('버블 밖에서는 라인을 그릴 수 없습니다');
                else {
                    startDrawing(cameraView, currentPosition, bubble.path);
                    isPaintingRef.current = true;
                }
            } else if (isEraseRef.current == false && modeRef.current == 'erase') {
                startErase(cameraView);
                isEraseRef.current = true;
            } else if (modeRef.current == 'move') {
                if (isMoveRef.current == false) {
                    isMoveRef.current = true;
                    grab(cameraView, currentPosition);
                }
            } else if (modeRef.current == 'bubble') {
                const { region, bubble } = identifyTouchRegion(cameraView, currentPosition, getBubbles());
                if (isCreateBubbleRef.current == false) {
                    if (region === 'name') {
                        if (bubble) {
                            const bubbleView = descendant2child(bubble, cameraView.path);
                            if (bubbleView) {
                                /**
                                 * 이름 터치시 input 띄어줘야함
                                 * 현재 구현 계획 X
                                 */
                                // const rect = rect2View(
                                //     {
                                //         top: bubbleView.top,
                                //         left: bubbleView.left,
                                //         width: bubbleView.width,
                                //         height: bubbleView.height,
                                //     },
                                //     cameraView,
                                // );
                                // showNameInput(bubble.name, {
                                //     top: rect.top - 40,
                                //     left: rect.left,
                                //     width: rect.width,
                                //     height: RENDERED_FONT_SIZE,
                                // });
                                // console.log(rect.top, rect.left);
                                // TODO showNameInput
                                //  top: rect.top - RENDERED_FONT_SIZE, left: rect.left 위치에
                            }
                        }

                        if (bubble) {
                            if (bubble.isBubblized === false) bubblize(bubble);
                            else unbubblize(bubble);
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
            }
        }
    }, []);

    const touch = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const mainLayer = getMainLayer();
        if (mainLayer == undefined) return;
        const currentPosition = getViewCoordinate(event, mainLayer);
        if (currentPosition) {
            if (isMoveRef.current && modeRef.current == 'move') {
                // const secondPosition = getSecondTouchCoordinate(event, mainLayerRef.current);
                drag(getCameraView(), currentPosition /*, secondPosition*/);
            } else if (isPaintingRef.current && modeRef.current == 'draw') {
                draw(getCameraView(), currentPosition, lineRenderer);
                curveRenderer(getDrawingCurve());
            } else if (isEraseRef.current && modeRef.current == 'erase') {
                erase(getCameraView(), currentPosition);
                reRender();
            } else if (modeRef.current == 'bubble') {
                if (isMoveBubbleRef.current) {
                    moveBubble(getCameraView(), currentPosition);
                    reRender();
                }
                if (isCreateBubbleRef.current) {
                    createBubble(getCameraView(), currentPosition);
                }
            }
        }
    }, []);

    const touchUp = useCallback(() => {
        if (isMoveRef.current && modeRef.current == 'move') {
            isMoveRef.current = false;
            release();
        } else if (isPaintingRef.current && modeRef.current == 'draw') {
            finishDrawing(getCameraView());
            reRender();
            isPaintingRef.current = false;
        } else if (isEraseRef.current && modeRef.current == 'erase') {
            endErase();
            isEraseRef.current = false;
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
