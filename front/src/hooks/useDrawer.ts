import { useCallback, useRef } from 'react';
import { useCurve } from '@/objects/curve/useCurve';
import { getThicknessRatio, view2Point } from '@/util/coordSys/conversion';
import { useBubble } from '@/objects/bubble/useBubble';
import { useLog } from '@/objects/log/useLog';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { curve2Rect } from '@/util/shapes/conversion';
import { useBubbleGun } from '@/hooks/useBubbleGun';

// functions about pen drawing
// features: draw curve
export const useDrawer = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { getNewCurve, setNewCurve, getNewCurvePath, setNewCurvePath, addControlPoint, addNewCurve } = useCurve();
    const { view2BubbleWithVector2D, setFocusBubblePath, addBubble } = useBubble();
    const { reRender } = useRenderer();
    const { getBubbleId, setBubbleId } = useBubbleGun(); // TODO bubbleIdRef을 useBubble로 옮기기

    /* logs */
    const { pushLog } = useLog();

    const startDrawing = useCallback((cameraView: ViewCoord, currentPosition: Vector2D, path: string | undefined) => {
        positionRef.current = currentPosition;
        setNewCurvePath(path ?? cameraView.path);
        setFocusBubblePath(path ?? cameraView.path);
        const pos = view2Point(
            {
                x: currentPosition.x,
                y: currentPosition.y,
            },
            cameraView,
        );

        // 버블 밖에 글씨를 쓸 경우 캔버스 기준으로 좌표 저장
        const position = getNewCurvePath() === '/' ? pos : view2BubbleWithVector2D(pos, cameraView, getNewCurvePath());
        addControlPoint({ ...position, isVisible: true }, true);
        reRender();
    }, []);

    const draw = useCallback(
        (
            cameraView: ViewCoord,
            currentPosition: Vector2D,
            lineRenderer: (startPoint: Vector2D, endPoint: Vector2D) => void,
        ) => {
            if (
                positionRef.current &&
                (positionRef.current.x != currentPosition.x || positionRef.current.y != currentPosition.y)
            ) {
                const currentPos = view2Point(
                    {
                        x: currentPosition.x,
                        y: currentPosition.y,
                    },
                    cameraView,
                );

                const position =
                    getNewCurvePath() === '/'
                        ? currentPos
                        : view2BubbleWithVector2D(currentPos, cameraView, getNewCurvePath());

                if (
                    getNewCurvePath() !== '/' &&
                    (position.x < -100 || position.x > 100 || position.y < -100 || position.y > 100)
                ) {
                    return;
                }

                if (addControlPoint({ ...position, isVisible: true }))
                    lineRenderer(positionRef.current, currentPosition);
            }
            positionRef.current = currentPosition;
        },
        [],
    );

    const finishDrawing = useCallback(
        (cameraView: ViewCoord) => {
            if (positionRef.current) {
                const pos = view2Point({ x: positionRef.current.x, y: positionRef.current.y }, cameraView);
                const position =
                    getNewCurvePath() === '/' ? pos : view2BubbleWithVector2D(pos, cameraView, getNewCurvePath());
                addControlPoint({ ...position, isVisible: true }, true);
            }
            // 버블 밖에 그릴 경우
            if (getNewCurvePath() === '/') {
                // 버블 밖에 커브를 그린 경우
                const rect = curve2Rect(getNewCurve(), 10);
                // TODO: useBubble로 id옮기고 bubble => mongle로 변경
                const bubbleName = 'bubble ' + getBubbleId().toString();
                const bubble: Bubble = {
                    top: rect.top,
                    left: rect.left,
                    height: rect.height,
                    width: rect.width,
                    path: '/' + bubbleName, // TODO 이름 바꾸기
                    name: bubbleName,
                    curves: [],
                    isBubblized: false,
                    isVisible: true,
                };
                setBubbleId(getBubbleId() + 1);
                addBubble(bubble, []);
                setNewCurvePath('/bubble');
                setFocusBubblePath('/bubble');
                setNewCurve([
                    ...getNewCurve().map((point): Point => {
                        const pos = view2BubbleWithVector2D({ x: point.x, y: point.y }, cameraView, '/bubble');
                        return { x: pos.x, y: pos.y, isVisible: point.isVisible };
                    }),
                ]);
            }
            const newCurve = addNewCurve(getThicknessRatio(cameraView));
            pushLog([{ type: 'create', object: newCurve, options: { path: getNewCurvePath() } }]);
        },

        [addNewCurve],
    );

    return { startDrawing, draw, finishDrawing };
};
