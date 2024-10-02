import { useBubble } from '@/objects/bubble/useBubble';
import { useCurve } from '@/objects/curve/useCurve';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { BUBBLE_BORDER_WIDTH } from '@/util/constant';
import { view2Point } from '@/util/coordSys/conversion';
import { isCollisionRectWithLine } from '@/util/shapes/collision';

import { useCallback, useRef } from 'react';

// functions about pen drawing
// features: draw curve
export const useEditor = () => {
    const { setCreatingBubble, getCreatingBubble, identifyTouchRegion, view2BubbleWithRect, getChildBubbles } =
        useBubble();
    const { setSelectedCurve, getSelectedCurve } = useCurve();
    const { createBubbleRender } = useRenderer();
    // 영역 잡을 때 사용하는 시작 영역
    const selectedStartPosRef = useRef<Vector2D | undefined>(undefined);
    // 커브를 선택할 버블을 나타냄
    const selectedBubbleRef = useRef<Bubble | undefined>(undefined);
    // 선택 영역을 나타냄
    const selectedRectRef = useRef<Rect>({ top: 0, left: 0, width: 0, height: 0 });

    const selectModeRef = useRef<'area' | 'move' | 'radio' | 'vertical' | 'horizontal' | 'none'>('none');

    /**
     * 선택 영역 그리기: 버블 내부에서만 가능
     * 커브 이동: 선택된 커브 내부 터치 -> 이동
     * 커브 크기 조정(radio)
     * 커브 크기 조정(vertical)
     * 커브 크기 조정(horizontal)
     */
    const startEditing = useCallback((cameraView: ViewCoord, currentPosition: Vector2D) => {
        const { region, bubble } = identifyTouchRegion(cameraView, currentPosition);
        if (bubble || region === 'inside') {
            selectedBubbleRef.current = bubble;
            selectModeRef.current = 'area';
            const pos = view2Point(
                {
                    x: currentPosition.x,
                    y: currentPosition.y,
                },
                cameraView,
            );
            if (pos) {
                selectedStartPosRef.current = pos;
                selectedRectRef.current = {
                    top: pos.y,
                    left: pos.x,
                    height: 0,
                    width: 0,
                };
            }
        } else {
            // curve의 touch region 구하기 => mode 결정
        }
    }, []);

    const editCurve = useCallback((cameraView: ViewCoord, pos: Vector2D) => {
        if (selectModeRef.current === 'area') {
            const currentPosition = view2Point(
                {
                    x: pos.x,
                    y: pos.y,
                },
                cameraView,
            );
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
                setCreatingBubble(currentRect);
                createBubbleRender(getCreatingBubble());
            }
        }
    }, []);

    const finishEditing = useCallback((cameraView: ViewCoord) => {
        if (selectModeRef.current == 'area') {
            // TODO 선택한 curve 고르기
            if (selectedBubbleRef.current) {
                const curves = selectedBubbleRef.current?.curves ?? [];
                const childBubble = getChildBubbles(selectedBubbleRef.current?.path);
                console.log(childBubble);
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
            }

            console.log('selected Curve', getSelectedCurve());
            selectModeRef.current = 'none';
            selectedRectRef.current = { top: 0, left: 0, width: 0, height: 0 };
            setCreatingBubble(selectedRectRef.current);
        }
    }, []);

    return { startEditing, editCurve, finishEditing };
};
