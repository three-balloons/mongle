import { useCurve } from '@/objects/curve/useCurve';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useBubbleStore } from '@/store/bubbleStore';
import { BUBBLE_BORDER_WIDTH } from '@/util/constant';
import { bubble2globalWithCurve, curve2View, global2bubbleWithCurve, view2Point } from '@/util/coordSys/conversion';
import { isCollisionRectWithLine } from '@/util/shapes/collision';
import { curve2Rect } from '@/util/shapes/conversion';
import { getTouchRegion, ResizeMode } from '@/util/shapes/getTouchRegion';

import { useCallback, useRef } from 'react';

const resizeMapping: { [key in ResizeMode]?: ResizeMode } = {
    leftside: 'leftside',
    rightside: 'rightside',
    topside: 'topside',
    bottomside: 'bottomside',
    topLeft: 'topLeft',
    topRight: 'topRight',
    bottomLeft: 'bottomLeft',
    bottomRight: 'bottomRight',
};

// functions about pen drawing
// features: draw curve
export const useEditor = () => {
    const identifyTouchRegion = useBubbleStore((state) => state.identifyTouchRegion);
    const view2BubbleWithRect = useBubbleStore((state) => state.view2BubbleWithRect);
    const getChildBubbles = useBubbleStore((state) => state.getChildBubbles);
    const descendant2child = useBubbleStore((state) => state.descendant2child);

    const { setSelectedCurve, getSelectedCurve } = useCurve();
    const { draggingRectRender, setDraggingRect, getDraggingRect, setEditingRect, getEditingRect } = useRenderer();
    // 영역 잡을 때 사용하는 시작 영역
    const selectedStartPosRef = useRef<Vector2D | undefined>(undefined);
    // 커브를 선택할 버블을 나타냄
    const selectedBubbleRef = useRef<Bubble | undefined>(undefined);
    // 선택 영역을 나타냄
    const selectedRectRef = useRef<Rect>({ top: 0, left: 0, width: 0, height: 0 });

    // 사이즈 조정 전의 영역
    const beforeResizeRectRef = useRef<Rect>({ top: 0, left: 0, width: 0, height: 0 });

    const selectModeRef = useRef<'area' | 'move' | 'resize' | 'none'>('none');
    // 움직이는 영역
    const resizeModeRef = useRef<ResizeMode | undefined>(undefined);
    const isFlipRef = useRef<{ x: boolean; y: boolean }>({ x: false, y: false });

    const initEditing = () => {
        selectModeRef.current = 'none';
        resizeModeRef.current = undefined;
        selectedBubbleRef.current = undefined;
        selectedRectRef.current = { top: 0, left: 0, width: 0, height: 0 };
        selectedStartPosRef.current = undefined;

        setSelectedCurve([]);
        setEditingRect(undefined);
    };
    /**
     * area: 영역 선택 중(커브는 버블 안에서만 가능) => TODO 밖에 터치시 editor icon 흔들리고 행동 취소
     * 버블 크기 조정/이동 => 버블 테두리 터치(1개만 선택 가능)
     * move: 선택된 커브 내부 터치 -> 이동
     * radio: 비율 조정
     * vertical: 수직 방향 크기 조정
     * horizontal: 수평 방향 크기 조정
     */
    const startEditing = useCallback((cameraView: ViewCoord, currentPosition: Vector2D) => {
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            cameraView,
        );
        if (selectModeRef.current == 'move') {
            const rect = getEditingRect();
            if (rect) {
                const region = getTouchRegion(rect, pos);
                switch (region) {
                    case 'outside':
                        initEditing();
                        break;
                    case 'inside':
                        break;
                    default:
                        if (resizeMapping[region]) {
                            resizeModeRef.current = resizeMapping[region];
                            selectModeRef.current = 'resize';
                            beforeResizeRectRef.current = rect;
                            isFlipRef.current = { x: false, y: false };
                        }
                        break;
                }
            } else {
                initEditing();
            }
        } else if (selectModeRef.current == 'none') {
            const { region, bubble } = identifyTouchRegion(cameraView, currentPosition);
            if (bubble || region === 'inside') {
                selectedBubbleRef.current = bubble;
            } else {
                // bubble 밖에서 드래그 할 경우 버블만 선택 가능
                selectedBubbleRef.current = undefined;
            }
            selectModeRef.current = 'area';
            if (pos) {
                selectedStartPosRef.current = pos;
                selectedRectRef.current = {
                    top: pos.y,
                    left: pos.x,
                    height: 0,
                    width: 0,
                };
            }
        }
    }, []);

    const editCurve = useCallback((cameraView: ViewCoord, pos: Vector2D) => {
        const currentPosition = view2Point(
            {
                x: pos.x,
                y: pos.y,
            },
            cameraView,
        );
        if (selectModeRef.current === 'area') {
            // TODO 영역이 버블 밖을 넘어가는지 확인 => 충돌 검사 하기
            if (
                selectedStartPosRef.current &&
                (selectedStartPosRef.current.x != currentPosition.x ||
                    selectedStartPosRef.current.y != currentPosition.y)
            ) {
                const { x, y } = selectedStartPosRef.current;

                const currentRect: Rect = {
                    top: Math.min(currentPosition.y, y),
                    left: Math.min(currentPosition.x, x),
                    height: Math.abs(currentPosition.y - y),
                    width: Math.abs(currentPosition.x - x),
                };
                selectedRectRef.current = currentRect;
                setDraggingRect(currentRect);
                draggingRectRender(currentRect);
            }
        } else if (selectModeRef.current == 'resize') {
            const { left, top, width, height } = beforeResizeRectRef.current;
            switch (resizeModeRef.current) {
                case 'leftside':
                    if (left + width < currentPosition.x !== isFlipRef.current.x)
                        isFlipRef.current.x = !isFlipRef.current.x;
                    setDraggingRect({
                        top: top,
                        left: Math.min(left + width, currentPosition.x),
                        height: height,
                        width: Math.abs(width + left - currentPosition.x),
                    });
                    draggingRectRender({
                        top: top,
                        left: Math.min(left + width, currentPosition.x),
                        height: height,
                        width: Math.abs(width + left - currentPosition.x),
                    });
                    break;
                case 'rightside':
                    if (left > currentPosition.x !== isFlipRef.current.x) isFlipRef.current.x = !isFlipRef.current.x;
                    setDraggingRect({
                        top: top,
                        left: Math.min(left, currentPosition.x),
                        height: height,
                        width: Math.abs(currentPosition.x - left),
                    });
                    draggingRectRender({
                        top: top,
                        left: Math.min(left, currentPosition.x),
                        height: height,
                        width: Math.abs(currentPosition.x - left),
                    });
                    break;
                case 'topside':
                    if (top + height < currentPosition.y !== isFlipRef.current.y)
                        isFlipRef.current.y = !isFlipRef.current.y;
                    setDraggingRect({
                        top: Math.min(top + height, currentPosition.y),
                        left: left,
                        height: Math.abs(top + height - currentPosition.y),
                        width: width,
                    });
                    draggingRectRender({
                        top: Math.min(top + height, currentPosition.y),
                        left: left,
                        height: Math.abs(top + height - currentPosition.y),
                        width: width,
                    });
                    break;
                case 'bottomside':
                    if (top > currentPosition.y !== isFlipRef.current.y) isFlipRef.current.y = !isFlipRef.current.y;
                    setDraggingRect({
                        top: Math.min(top, currentPosition.y),
                        left: left,
                        height: Math.abs(currentPosition.y - top),
                        width: width,
                    });
                    draggingRectRender({
                        top: Math.min(top, currentPosition.y),
                        left: left,
                        height: Math.abs(currentPosition.y - top),
                        width: width,
                    });
                    break;
                case 'topLeft':
                    if (
                        (top + height < currentPosition.y && left + width < currentPosition.x) !== isFlipRef.current.x
                    ) {
                        isFlipRef.current.x = !isFlipRef.current.x;
                        isFlipRef.current.y = !isFlipRef.current.y;
                    }

                    if (
                        ((currentPosition.x > left + width && currentPosition.y > top + height) ||
                            (currentPosition.x < left && currentPosition.y < top)) ==
                        width * (currentPosition.y - top) > height * (currentPosition.x - left)
                    ) {
                        // follow Y
                        const newHeight = Math.abs(top + height - currentPosition.y);
                        const newWidth = (width * newHeight) / height;

                        setDraggingRect({
                            top: Math.min(top + height, currentPosition.y),
                            left: currentPosition.y < top + height ? left + width - newWidth : left + width,
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: Math.min(top + height, currentPosition.y),
                            left: currentPosition.y < top + height ? left + width - newWidth : left + width,
                            height: newHeight,
                            width: newWidth,
                        });
                    } else {
                        // follow X
                        const newWidth = Math.abs(left + width - currentPosition.x);
                        const newHeight = (height * newWidth) / width;
                        setDraggingRect({
                            top: currentPosition.x < left + width ? top + height - newHeight : top + height,
                            left: Math.min(left + width, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: currentPosition.x < left + width ? top + height - newHeight : top + height,
                            left: Math.min(left + width, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                    }
                    break;
                case 'topRight':
                    if ((currentPosition.x < left && top + height < currentPosition.y) !== isFlipRef.current.x) {
                        isFlipRef.current.x = !isFlipRef.current.x;
                        isFlipRef.current.y = !isFlipRef.current.y;
                    }

                    if (
                        ((currentPosition.y < top && left + width < currentPosition.x) ||
                            (top + height < currentPosition.y && currentPosition.x < left)) ==
                        width * (currentPosition.y - top - height) < height * (left - currentPosition.x)
                    ) {
                        const newHeight = Math.abs(top + height - currentPosition.y);
                        const newWidth = (width * newHeight) / height;
                        setDraggingRect({
                            top: Math.min(top + height, currentPosition.y),
                            left: currentPosition.y < top + height ? left : left - newWidth,
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: Math.min(top + height, currentPosition.y),
                            left: currentPosition.y < top + height ? left : left - newWidth,
                            height: newHeight,
                            width: newWidth,
                        });
                    } else {
                        // follow X
                        const newWidth = Math.abs(currentPosition.x - left);
                        const newHeight = (height * newWidth) / width;
                        setDraggingRect({
                            top: currentPosition.x > left ? top + height - newHeight : top + height,
                            left: Math.min(left, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: currentPosition.x > left ? top + height - newHeight : top + height,
                            left: Math.min(left, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                    }
                    break;
                case 'bottomLeft':
                    if ((currentPosition.y < top && left + width < currentPosition.x) !== isFlipRef.current.x) {
                        isFlipRef.current.x = !isFlipRef.current.x;
                        isFlipRef.current.y = !isFlipRef.current.y;
                    }
                    if (
                        ((currentPosition.y < top && left + width < currentPosition.x) ||
                            (top + height < currentPosition.y && currentPosition.x < left)) ==
                        width * (currentPosition.y - top - height) < height * (left - currentPosition.x)
                    ) {
                        const newHeight = Math.abs(currentPosition.y - top);
                        const newWidth = (width * newHeight) / height;
                        // follow Y
                        setDraggingRect({
                            top: Math.min(top, currentPosition.y),
                            left: currentPosition.y > top ? left + width - newWidth : left + width,
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: Math.min(top, currentPosition.y),
                            left: currentPosition.y > top ? left + width - newWidth : left + width,
                            height: newHeight,
                            width: newWidth,
                        });
                    } else {
                        // follow X
                        const newWidth = Math.abs(left + width - currentPosition.x);
                        const newHeight = (height * newWidth) / width;
                        setDraggingRect({
                            top: currentPosition.x < left + width ? top : top - newHeight,
                            left: Math.min(left + width, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: currentPosition.x < left + width ? top : top - newHeight,
                            left: Math.min(left + width, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                    }
                    break;
                case 'bottomRight':
                    if ((top > currentPosition.y && left > currentPosition.x) !== isFlipRef.current.x) {
                        isFlipRef.current.x = !isFlipRef.current.x;
                        isFlipRef.current.y = !isFlipRef.current.y;
                    }
                    if (
                        ((currentPosition.x <= left + width || currentPosition.y <= top + height) &&
                            (currentPosition.x >= left || currentPosition.y >= top)) ==
                        width * (currentPosition.y - top) > height * (currentPosition.x - left)
                    ) {
                        const newHeight = Math.abs(currentPosition.y - top);
                        const newWidth = (width * newHeight) / height;
                        // follow Y
                        setDraggingRect({
                            top: Math.min(top, currentPosition.y),
                            left: currentPosition.y > top ? left : left - newWidth,
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: Math.min(top, currentPosition.y),
                            left: currentPosition.y > top ? left : left - newHeight,
                            height: newHeight,
                            width: newWidth,
                        });
                    } else {
                        // follow X
                        const newWidth = Math.abs(currentPosition.x - left);
                        const newHeight = (height * newWidth) / width;
                        setDraggingRect({
                            top: currentPosition.x > left ? top : top - newHeight,
                            left: Math.min(left, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                        draggingRectRender({
                            top: currentPosition.x > left ? top : top - newHeight,
                            left: Math.min(left, currentPosition.x),
                            height: newHeight,
                            width: newWidth,
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }, []);

    const finishEditing = useCallback((cameraView: ViewCoord) => {
        if (selectModeRef.current == 'area') {
            // TODO 선택한 curve 고르기
            if (selectedBubbleRef.current) {
                const curves = selectedBubbleRef.current?.curves ?? [];

                const rect = view2BubbleWithRect(
                    {
                        top: selectedRectRef.current.top - BUBBLE_BORDER_WIDTH,
                        left: selectedRectRef.current.left - BUBBLE_BORDER_WIDTH,
                        width: selectedRectRef.current.width + 2 * BUBBLE_BORDER_WIDTH,
                        height: selectedRectRef.current.height + 2 * BUBBLE_BORDER_WIDTH,
                    },
                    cameraView,
                    selectedBubbleRef.current.path,
                );
                setSelectedCurve([
                    // TODO 선택된 버블 넣는 로직 추가
                    ...curves.filter((curve) => {
                        for (let i = 0; i < curve.position.length - 1; i++) {
                            if (
                                isCollisionRectWithLine(rect, [
                                    curve.position[i] as Vector2D,
                                    curve.position[i + 1] as Vector2D,
                                ])
                            ) {
                                return true;
                            }
                        }
                        return false;
                    }),
                ]);
                const bubbleView = descendant2child(selectedBubbleRef.current, cameraView.path);
                setEditingRect(
                    curve2Rect(
                        getSelectedCurve().flatMap((curve) => bubble2globalWithCurve(curve.position, bubbleView)),
                        3 * BUBBLE_BORDER_WIDTH,
                    ),
                );
                selectModeRef.current = 'move';
            } else {
                // 영역 안에 버블이 존재하는지 확인
                initEditing();
            }

            selectedRectRef.current = { top: 0, left: 0, width: 0, height: 0 };
            setDraggingRect(undefined);
        } else if (selectModeRef.current == 'resize') {
            // TODO 뒤집히는것도 고려할 것

            const rect = getDraggingRect();
            if (rect && selectedBubbleRef.current && beforeResizeRectRef.current) {
                const { left, top, width, height } = beforeResizeRectRef.current;
                // constants
                const normalFactorX = rect.width / width;
                const normalFactorY = rect.height / height;
                const normalMovementX = rect.left - left * normalFactorX;
                const flipMovementX = (2 * left + width) * normalFactorX + normalMovementX;
                const normalMovementY = rect.top - top * normalFactorY;
                const flipMovementY = (2 * top + height) * normalFactorY + normalMovementY;

                const factorX = isFlipRef.current.x ? -normalFactorX : normalFactorX;
                const factorY = isFlipRef.current.y ? -normalFactorY : normalFactorY;
                const movementX = isFlipRef.current.x ? flipMovementX : normalMovementX;
                const movementY = isFlipRef.current.y ? flipMovementY : normalMovementY;

                const bubbleView = descendant2child(selectedBubbleRef.current, cameraView.path);

                // TODO log에 남기려면 update 연산 필요
                getSelectedCurve().forEach((curve) => {
                    curve.position = global2bubbleWithCurve(
                        bubble2globalWithCurve(curve.position, bubbleView).map(({ x, y, isVisible }) => ({
                            x: x * factorX + movementX,
                            y: y * factorY + movementY,
                            isVisible: isVisible,
                        })),
                        bubbleView,
                    );
                });

                setEditingRect(rect);
            }

            if (rect) selectModeRef.current = 'move';
        } else if (selectModeRef.current !== 'none') {
            selectModeRef.current = 'move';
        }
    }, []);

    return { startEditing, editCurve, finishEditing };
};
