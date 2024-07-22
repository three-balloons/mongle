import { useBubble } from '@/objects/useBubble';
import { bubble2rect, rect2View, view2Point } from '@/util/coordSys/conversion';
import { getParentPath, getPathDepth, getPathDifferentDepth } from '@/util/path/path';
import { isCollisionPointWithRect } from '@/util/shapes/collision';
import { subVector2D } from '@/util/shapes/operator';
import { useCallback, useRef } from 'react';

export const useBubbleGun = () => {
    const createdBubblePosRef = useRef<Vector2D | undefined>();
    const createdBubblePathRef = useRef<string>('/');
    const bubbleIdRef = useRef<number>(0);
    const moveBubbleRef = useRef<Bubble | undefined>();
    const moveBubbleOffsetRef = useRef<Vector2D | undefined>();
    const { updateCreatingBubble, addBubble, getCreatingBubble, findBubble } = useBubble();
    const startCreateBubble = useCallback((canvasView: ViewCoord, currentPosition: Vector2D, path: string) => {
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        if (pos) createdBubblePosRef.current = pos;
        createdBubblePathRef.current = path;
    }, []);

    const createBubble = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        if (
            createdBubblePosRef.current &&
            (createdBubblePosRef.current.x != currentPosition.x || createdBubblePosRef.current.y != currentPosition.y)
        ) {
            const currentPos = view2Point(
                {
                    x: currentPosition.x,
                    y: currentPosition.y,
                },
                canvasView,
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

    const finishCreateBubble = useCallback((canvasView: ViewCoord) => {
        const bubbleRect = getCreatingBubble();
        const bubble: Bubble = {
            ...bubbleRect,
            path: createdBubblePathRef.current + bubbleIdRef.current.toString() + '/',
            curves: [],
            children: [],
            parent: undefined,
            isBubblized: false,
        };
        const parentBubble = findBubble(createdBubblePathRef.current);
        if (parentBubble) {
            const bubbleView = descendant2child(parentBubble, canvasView.path);
            const rect = bubble2rect(bubbleRect, bubbleView);
            bubble.height = rect.height;
            bubble.width = rect.width;
            bubble.top = rect.top;
            bubble.left = rect.left;
        }
        bubbleIdRef.current += 1;
        createdBubblePathRef.current = '/';
        addBubble(bubble);
    }, []);

    const startMoveBubble = useCallback((canvasView: ViewCoord, currentPosition: Vector2D, bubble: Bubble) => {
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        if (pos) moveBubbleOffsetRef.current = subVector2D(pos, { y: bubble.top, x: bubble.left });
        moveBubbleRef.current = bubble;
    }, []);

    const moveBubble = useCallback((canvasView: ViewCoord, currentPosition: Vector2D) => {
        const currentPos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            canvasView,
        );
        const { x, y } = subVector2D(currentPos, moveBubbleOffsetRef.current as Vector2D);
        if (moveBubbleRef.current) {
            moveBubbleRef.current.top = y;
            moveBubbleRef.current.left = x;
        }
    }, []);

    // 버블 안인지 밖인지 테두리인지 판단하는 함수
    // TODO renaming
    const identifyTouchRegion = (
        canvasView: ViewCoord,
        position: Vector2D,
        bubbles: Array<Bubble>,
    ): { region: 'inside' | 'outside' | 'border'; bubble: Bubble | undefined } => {
        bubbles.sort((a, b) => getPathDepth(b.path) - getPathDepth(a.path));
        for (const bubble of bubbles) {
            const bubbleView = descendant2child(bubble, canvasView.path);
            if (bubbleView) {
                const rect = rect2View(
                    {
                        top: bubbleView.top,
                        left: bubbleView.left,
                        width: bubbleView.width,
                        height: bubbleView.height,
                    },
                    canvasView,
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

    // 자손버블좌표계에서 자식버블좌표계로 변환
    // 사용처: 버블 이동, 내부의 요소를 canvasView로 변환하기 위한 사전 작업
    // TODO: 최적화
    // TODO useBubble에 의존하고 있음
    // 의존성 제거 혹은 계산부분 분리 필요
    const descendant2child = (descendant: Bubble, ancestorPath: string): Bubble | undefined => {
        const depth = getPathDifferentDepth(ancestorPath, descendant.path);
        if (depth == undefined) return undefined;
        if (depth == 0) return descendant; // depth가 0인 경우 자체가 존재하지 않음
        if (depth == 1)
            return descendant; // descendant is child
        else if (depth > 1) {
            const ret: Bubble = { ...descendant };
            let parent: Bubble | undefined = ret;
            for (let i = 1; i < depth; i++) {
                const path = getParentPath(ret.path);
                if (path == undefined) return undefined;
                parent = findBubble(path);
                if (parent == undefined) return undefined;
                ret.path = parent.path;
                ret.top = (parent.height * (100 + ret.top)) / 200 + parent.top;
                ret.left = (parent.width * (100 + ret.left)) / 200 + parent.left;
                ret.height = (parent.height * ret.height) / 200;
                ret.width = (parent.width * ret.width) / 200;
            }
            return ret;
        }
    };

    return {
        startCreateBubble,
        createBubble,
        finishCreateBubble,
        startMoveBubble,
        moveBubble,
        identifyTouchRegion,
        descendant2child,
    };
};
