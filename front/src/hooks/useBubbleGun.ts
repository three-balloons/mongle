import { useBubble } from '@/objects/bubble/useBubble';
import { useLog } from '@/objects/log/useLog';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useConfigStore } from '@/store/configStore';
import { MINIMUN_RENDERED_BUBBLE_SIZE } from '@/util/constant';
import { global2bubbleWithRect, rect2View, view2Point } from '@/util/coordSys/conversion';
import { getParentPath, getPathDepth } from '@/util/path/path';
import {
    isCollisionPointWithRect,
    isCollisionWithRect,
    isCollisionWithRectExceptIncluding,
} from '@/util/shapes/collision';
import { subVector2D } from '@/util/shapes/operator';
import { useCallback, useRef } from 'react';

/**
 * functions about bubble
 * features: create bubble, bubblize, unbubblize, move bubble
 */
export const useBubbleGun = () => {
    const createdBubblePosRef = useRef<Vector2D | undefined>();
    const createdBubblePathRef = useRef<string>('/');
    const bubbleIdRef = useRef<number>(0);
    const startMoveBubblePosRef = useRef<Vector2D | undefined>();
    const moveBubbleRef = useRef<Bubble | undefined>();
    const moveBubbleOffsetRef = useRef<Vector2D | undefined>();
    const {
        setFocusBubblePath,
        setCreatingBubble,
        addBubble,
        getCreatingBubble,
        getBubbles,
        getRatioWithCamera,
        findBubble,
        descendant2child,
        view2BubbleWithVector2D,
        view2BubbleWithRect,
        getBubbleInTree,
        getChildBubbles,
        getDescendantBubbles,
    } = useBubble();
    const { bubbleTransitAnimation, reRender, createBubbleRender } = useRenderer();

    /* logs */
    const { pushLog } = useLog();

    const { isShowAnimation } = useConfigStore((state) => state);
    const startCreateBubble = useCallback((cameraView: ViewCoord, currentPosition: Vector2D, path: string) => {
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            cameraView,
        );

        // 저장시 cameraView 좌표계로 저장
        if (pos) createdBubblePosRef.current = pos;
        createdBubblePathRef.current = path;
        setFocusBubblePath(path);
        reRender();
    }, []);

    const createBubble = useCallback((cameraView: ViewCoord, pos: Vector2D) => {
        const currentPosition = view2Point(
            {
                x: pos.x,
                y: pos.y,
            },
            cameraView,
        );

        if (
            createdBubblePosRef.current &&
            (createdBubblePosRef.current.x != currentPosition.x || createdBubblePosRef.current.y != currentPosition.y)
        ) {
            const { x, y } = createdBubblePosRef.current;
            const currentRect: Rect = {
                top: Math.min(currentPosition.y, y),
                left: Math.min(currentPosition.x, x),
                height: Math.abs(currentPosition.y - y),
                width: Math.abs(currentPosition.x - x),
            };
            // bubble내의 좌표계로 전환
            const bubbleRect = view2BubbleWithRect(currentRect, cameraView, createdBubblePathRef.current);
            const siblings = getDescendantBubbles(createdBubblePathRef.current);
            let isCollision = siblings.some((sibling) =>
                isCollisionWithRectExceptIncluding(sibling as Rect, bubbleRect),
            );
            if (
                createdBubblePathRef.current != '/' &&
                (bubbleRect.top < -100 ||
                    bubbleRect.top + bubbleRect.height > 100 ||
                    bubbleRect.left < -100 ||
                    bubbleRect.left + bubbleRect.width > 100)
            )
                isCollision = true;
            if (currentPosition && !isCollision) setCreatingBubble(currentRect);
            createBubbleRender(getCreatingBubble());
        }
    }, []);

    const finishCreateBubble = useCallback((cameraView: ViewCoord) => {
        const bubbleRect = getCreatingBubble();
        const { height, width } = rect2View(bubbleRect, cameraView);
        if (height < MINIMUN_RENDERED_BUBBLE_SIZE || width < MINIMUN_RENDERED_BUBBLE_SIZE) {
            console.error('생성하려는 버블의 크기가 너무 작습니다');
            return;
        }
        const name = bubbleIdRef.current.toString();

        const bubble: Bubble = {
            ...bubbleRect,
            path: createdBubblePathRef.current == '/' ? '/' + name : createdBubblePathRef.current + '/' + name,
            name: name,
            curves: [],
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
        const childrenPaths = getChildBubbles(createdBubblePathRef.current)
            .filter((child) => {
                // isInside 유틸함수 만들기
                if (
                    bubble.top < child.top &&
                    bubble.left < child.left &&
                    child.top + child.height < bubble.top + bubble.height &&
                    child.left + child.width < bubble.left + bubble.width
                )
                    return true;
            })
            .map((child) => {
                return child.path;
            });

        const createBubbleLog: LogGroup = [];
        // childrenPaths.forEach((childPath) => {
        //     const child = findBubble(childPath);
        //     if (child) {
        //         const grandChildrenPaths = getChildBubbles(childPath).map((child) => child.path);
        //         createBubbleLog.push({
        //             type: 'update',
        //             object: child,
        //             options: { childrenPaths: grandChildrenPaths },
        //         });
        //     }
        // });
        createBubbleLog.push({ type: 'create', object: bubble, options: { childrenPaths: childrenPaths } });

        addBubble(bubble, childrenPaths);
        setFocusBubblePath(bubble.path);
        pushLog(createBubbleLog);

        bubbleIdRef.current += 1;
        createdBubblePathRef.current = '/';
        setCreatingBubble({
            top: 0,
            left: 0,
            height: 0,
            width: 0,
        });
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
        startMoveBubblePosRef.current = subVector2D(pos, moveBubbleOffsetRef.current);
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

    const finishMoveBubble = useCallback((cameraView: ViewCoord) => {
        if (!moveBubbleRef.current) return;
        const bubbleView = descendant2child(moveBubbleRef.current, cameraView.path);
        if (bubbleView == undefined) return;
        const moveRect: Rect = {
            height: bubbleView.height,
            width: bubbleView.width,
            top: bubbleView.top,
            left: bubbleView.left,
        };
        const parentPath = getParentPath(moveBubbleRef.current.path) ?? '/';
        const isCanMove = !getBubbles().find((bubble) => {
            if (!bubble.isVisible) return false;
            if (bubble == moveBubbleRef.current) return false;
            if (bubble.path == parentPath) return false;
            const ratio = getRatioWithCamera(bubble, cameraView);
            if (ratio && ratio * cameraView.size.x < MINIMUN_RENDERED_BUBBLE_SIZE) {
                return false;
            }
            const bubbleView = descendant2child(bubble, cameraView.path);
            if (bubbleView == undefined) return false;
            return isCollisionWithRect(moveRect, {
                height: bubbleView.height,
                width: bubbleView.width,
                top: bubbleView.top,
                left: bubbleView.left,
            });
        });
        if (!isCanMove && startMoveBubblePosRef.current) {
            if (isShowAnimation)
                bubbleTransitAnimation(
                    moveBubbleRef.current,
                    { x: moveBubbleRef.current.left, y: moveBubbleRef.current.top },
                    { x: startMoveBubblePosRef.current.x, y: startMoveBubblePosRef.current.y },
                );
            else {
                moveBubbleRef.current.left = startMoveBubblePosRef.current.x;
                moveBubbleRef.current.top = startMoveBubblePosRef.current.y;
            }
        } else {
            // 이동 성공, 로그 추가
            const bubble = moveBubbleRef.current;
            const childrenPaths = getChildBubbles(bubble.path)
                .filter((child) => {
                    // isInside 유틸함수 만들기
                    if (
                        bubble.top < child.top &&
                        bubble.left < child.left &&
                        child.top + child.height < bubble.top + bubble.height &&
                        child.left + child.width < bubble.left + bubble.width
                    )
                        return true;
                })
                .map((child) => {
                    return child.path;
                });
            console.log({
                ...moveBubbleRef.current,
                left: startMoveBubblePosRef.current?.x,
                top: startMoveBubblePosRef.current?.y,
            });
            console.log(moveBubbleRef.current);
            //
            pushLog([
                {
                    type: 'delete',
                    object: { ...moveBubbleRef.current, ...startMoveBubblePosRef.current },
                    options: { childrenPaths: childrenPaths },
                },
                {
                    type: 'create',
                    object: moveBubbleRef.current,
                    options: { childrenPaths: childrenPaths },
                },
            ]);
            moveBubbleRef.current;
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
            if (!bubble.isVisible) continue;
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
        bubble.curves.forEach((curve) => (curve.isVisible = false));

        const node = getBubbleInTree(bubble);
        if (node == undefined) return;
        for (const child of node.children) {
            if (child.this) _setIsVisibleAll(child.this, false);
        }
    };

    const unbubblize = (bubble: Bubble) => {
        bubble.isBubblized = false;
        bubble.curves.forEach((curve) => (curve.isVisible = true));
        const node = getBubbleInTree(bubble);
        if (node == undefined) return;
        for (const child of node.children) {
            if (child.this) _setIsVisibleAll(child.this, true);
        }
    };

    const _setIsVisibleAll = (bubble: Bubble, isVisible: boolean) => {
        bubble.isVisible = isVisible;
        if (!bubble.isBubblized) bubble.curves.forEach((curve) => (curve.isVisible = isVisible));
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
        finishMoveBubble,
        identifyTouchRegion,
        bubblize,
        unbubblize,
    };
};
