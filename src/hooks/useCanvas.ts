import { useEffect, useRef } from 'react';
import { useCurve } from '@/objects/curve/useCurve';
import { useDrawer } from '@/hooks/useDrawer';
import { useConfigStore } from '@/store/configStore';
import { useEraser } from '@/hooks/useEraser';
import { useBubbleGun } from '@/hooks/useBubbleGun';
import { useBubble } from '@/objects/bubble/useBubble';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useEditor } from '@/hooks/useEditor';
import { useHand } from '@/hooks/useHand';

/**
 * store canvas infromation and command functions
 */
// control logic
export const useCanvas = () => {
    const { mode } = useConfigStore((state) => state);

    /* state variable */
    const modeRef = useRef<ControlMode>(mode);
    const isEraseRef = useRef<boolean>(false);
    const isPaintingRef = useRef(false);
    const isMoveRef = useRef(false);
    const isCreateBubbleRef = useRef(false);
    const isMoveBubbleRef = useRef(false);
    const isEditRef = useRef(false);

    const { getNewCurve } = useCurve();
    const { identifyTouchRegion, getCreatingBubble } = useBubble();

    /* tools */
    const { getCameraView, reRender, curveRenderer, lineRenderer, eraseRender, createBubbleRender } = useRenderer();
    const { startDrawing, draw, finishDrawing, cancelDrawing } = useDrawer();
    const { startErase, erase, endErase, eraseBubble } = useEraser();
    const { grab, drag, release } = useHand();
    const { startEditing, editCurve, finishEditing } = useEditor();
    const { startCreateBubble, createBubble, finishCreateBubble, startMoveBubble, moveBubble, finishMoveBubble } =
        useBubbleGun();

    useEffect(() => {
        useConfigStore.subscribe(({ mode }) => {
            modeRef.current = mode;
        });
    }, []);

    const setupAction = (currentPosition: Vector2D) => {
        const cameraView = getCameraView();
        if (isPaintingRef.current == false && modeRef.current == 'draw') {
            const { bubble } = identifyTouchRegion(cameraView, currentPosition);
            if (bubble === undefined) startDrawing(cameraView, currentPosition, '/');
            else startDrawing(cameraView, currentPosition, bubble.path);
            isPaintingRef.current = true;
        } else if (isMoveRef.current == false && modeRef.current == 'move') {
            grab(cameraView, currentPosition);
            isMoveRef.current = true;
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
    };

    const executeAction = (currentPosition: Vector2D) => {
        if (isPaintingRef.current && modeRef.current == 'draw') {
            draw(getCameraView(), currentPosition, lineRenderer);
            curveRenderer(getNewCurve());
        } else if (isMoveRef.current && modeRef.current == 'move') {
            drag(getCameraView(), currentPosition);
            reRender();
        } else if (isEraseRef.current && modeRef.current == 'erase') {
            erase(getCameraView(), currentPosition);
            reRender();
            eraseRender(currentPosition);
        } else if (modeRef.current == 'bubble') {
            if (isMoveBubbleRef.current) {
                moveBubble(getCameraView(), currentPosition);
                reRender();
            }
            if (isCreateBubbleRef.current) {
                createBubble(getCameraView(), currentPosition);
                reRender();
                createBubbleRender(getCreatingBubble());
            }
        } else if (modeRef.current == 'edit') {
            editCurve(getCameraView(), currentPosition);
        }
    };

    const terminateAction = (isCancel: boolean) => {
        if (isPaintingRef.current && modeRef.current == 'draw') {
            isPaintingRef.current = false;
            if (isCancel) cancelDrawing();
            else finishDrawing(getCameraView());
            reRender();
        } else if (isMoveRef.current && modeRef.current == 'move') {
            release();
            isMoveRef.current = false;
        } else if (isEraseRef.current && modeRef.current == 'erase') {
            endErase();
            isEraseRef.current = false;
            reRender();
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
    };

    return {
        modeRef,
        setupAction,
        executeAction,
        terminateAction,
    };
};
