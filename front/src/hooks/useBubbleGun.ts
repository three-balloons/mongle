import { useBubble } from '@/objects/bubble/useBubble';
import { useCurve } from '@/objects/curve/useCurve';
import { global2bubbleWithRect, rect2View, view2Point } from '@/util/coordSys/conversion';
import { getParentPath, getPathDepth } from '@/util/path/path';
import { isCollisionPointWithRect } from '@/util/shapes/collision';
import { subVector2D } from '@/util/shapes/operator';
import { useCallback, useRef } from 'react';

/**
 * functions about bubble
 * features: create bubble, bubblize, unbubblize, move bubble
 * @returns
 */
export const useBubbleGun = () => {
    const createdBubblePosRef = useRef<Vector2D | undefined>();
    const createdBubblePathRef = useRef<string>('/');
    const bubbleIdRef = useRef<number>(0);
    const moveBubbleRef = useRef<Bubble | undefined>();
    const moveBubbleOffsetRef = useRef<Vector2D | undefined>();
    const {
        updateCreatingBubble,
        addBubble,
        getCreatingBubble,
        findBubble,
        descendant2child,
        view2BubbleWithVector2D,
        getBubbleInTree,
    } = useBubble();
    const { getCurvesWithPath } = useCurve();
    const startCreateBubble = useCallback((cameraView: ViewCoord, currentPosition: Vector2D, path: string) => {
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            cameraView,
        );
        if (pos) createdBubblePosRef.current = pos;
        createdBubblePathRef.current = path;
    }, []);

    const createBubble = useCallback((cameraView: ViewCoord, currentPosition: Vector2D) => {
        if (
            createdBubblePosRef.current &&
            (createdBubblePosRef.current.x != currentPosition.x || createdBubblePosRef.current.y != currentPosition.y)
        ) {
            const currentPos = view2Point(
                {
                    x: currentPosition.x,
                    y: currentPosition.y,
                },
                cameraView,
            );
            const { x, y } = createdBubblePosRef.current;
            if (currentPos)
                updateCreatingBubble({
                    top: Math.min(currentPos.y, y),
                    left: Math.min(currentPos.x, x),
                    height: Math.abs(currentPos.y - y),
                    width: Math.abs(currentPos.x - x),
                });
        }
    }, []);

    const finishCreateBubble = useCallback((cameraView: ViewCoord) => {
        const bubbleRect = getCreatingBubble();
        const bubble: Bubble = {
            ...bubbleRect,
            path: createdBubblePathRef.current + bubbleIdRef.current.toString() + '/',
            curves: [],
            children: [],
            parent: undefined,
            isBubblized: false,
            isVisible: true,
        };
        const parentBubble = findBubble(createdBubblePathRef.current);
        if (parentBubble) {
            const bubbleView = descendant2child(parentBubble, cameraView.path);
            const rect = global2bubbleWithRect(bubbleRect, bubbleView);
            bubble.height = rect.height;
            bubble.width = rect.width;
            bubble.top = rect.top;
            bubble.left = rect.left;
        }
        bubbleIdRef.current += 1;
        createdBubblePathRef.current = '/';
        addBubble(bubble);
    }, []);

    const startMoveBubble = useCallback((cameraView: ViewCoord, currentPosition: Vector2D, bubble: Bubble) => {
        let pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            cameraView,
        );
        if (pos == undefined) return;

        const parentPath = getParentPath(bubble.path);
        if (parentPath) {
            pos = view2BubbleWithVector2D(pos, cameraView, parentPath);
        }
        moveBubbleOffsetRef.current = subVector2D(pos, { y: bubble.top, x: bubble.left });

        moveBubbleRef.current = bubble;
    }, []);

    const moveBubble = useCallback((cameraView: ViewCoord, currentPosition: Vector2D) => {
        let currentPos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            cameraView,
        );
        if (!moveBubbleRef.current) return;

        const parentPath = getParentPath(moveBubbleRef.current.path);
        if (parentPath) {
            currentPos = view2BubbleWithVector2D(currentPos, cameraView, parentPath);
            const { x, y } = subVector2D(currentPos, moveBubbleOffsetRef.current as Vector2D);
            if (moveBubbleOffsetRef.current) {
                moveBubbleRef.current.top = y;
                moveBubbleRef.current.left = x;
            }
        }
    }, []);

    /**
     * 버블 안인지 밖인지 테두리인지 판단하는 함수
     */
    // TODO renaming
    const identifyTouchRegion = (
        cameraView: ViewCoord,
        position: Vector2D,
        bubbles: Array<Bubble>,
    ): { region: 'inside' | 'outside' | 'border'; bubble: Bubble | undefined } => {
        bubbles.sort((a, b) => getPathDepth(b.path) - getPathDepth(a.path));
        for (const bubble of bubbles) {
            const bubbleView = descendant2child(bubble, cameraView.path);
            if (bubbleView) {
                const rect = rect2View(
                    {
                        top: bubbleView.top,
                        left: bubbleView.left,
                        width: bubbleView.width,
                        height: bubbleView.height,
                    },
                    cameraView,
                );
                if (
                    isCollisionPointWithRect(position, {
                        top: rect.top - rect.height * 0.05,
                        left: rect.left - rect.width * 0.05,
                        width: rect.width * 1.1,
                        height: rect.height * 1.1,
                    })
                )
                    if (
                        isCollisionPointWithRect(position, {
                            top: rect.top + rect.height * 0.05,
                            left: rect.left + rect.width * 0.05,
                            width: rect.width * 0.9,
                            height: rect.height * 0.9,
                        })
                    )
                        return {
                            region: 'inside',
                            bubble: bubble,
                        };
                    else
                        return {
                            region: 'border',
                            bubble: bubble,
                        };
            }
        }
        return {
            region: 'outside',
            bubble: undefined,
        };
    };

    const bubblize = (bubble: Bubble) => {
        bubble.isBubblized = true;
        getCurvesWithPath(bubble.path).forEach((curve) => (curve.isVisible = false));

        const node = getBubbleInTree(bubble);
        if (node == undefined) return;
        for (const child of node.children) {
            if (child.this) _setIsVisibleAll(child.this, false);
        }
    };

    const unbubblize = (bubble: Bubble) => {
        bubble.isBubblized = false;
        getCurvesWithPath(bubble.path).forEach((curve) => (curve.isVisible = true));
        const node = getBubbleInTree(bubble);
        if (node == undefined) return;
        for (const child of node.children) {
            if (child.this) _setIsVisibleAll(child.this, true);
        }
    };

    const _setIsVisibleAll = (bubble: Bubble, isVisible: boolean) => {
        bubble.isVisible = isVisible;
        getCurvesWithPath(bubble.path).forEach((curve) => (curve.isVisible = isVisible));
        const node = getBubbleInTree(bubble);
        if (node == undefined) return;
        for (const child of node.children) {
            if (child.this) _setIsVisibleAll(child.this, isVisible);
        }
    };

    return {
        startCreateBubble,
        createBubble,
        finishCreateBubble,
        startMoveBubble,
        moveBubble,
        identifyTouchRegion,
        bubblize,
        unbubblize,
    };
};
