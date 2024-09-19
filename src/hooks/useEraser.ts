import { useCallback, useEffect, useRef } from 'react';
import { useCurve } from '@/objects/curve/useCurve';
import { view2Point } from '@/util/coordSys/conversion';
import { curve2Rect } from '@/util/shapes/conversion';
import { isCollisionCapsuleWithCircle, isCollisionRectWithCircle } from '@/util/shapes/collision';
import { useConfigStore } from '@/store/configStore';
import { useBubble } from '@/objects/bubble/useBubble';
import { useLog } from '@/objects/log/useLog';

type CurveAndEraser = {
    path: string;
    curve: Curve;
    eraser: Circle;
};

/**
 * eraser 좌표를 버블 좌표로 바꿔서 계산
 * functions about erasing
 * @function erase
 * @returns
 */
export const useEraser = () => {
    const positionRef = useRef<Vector2D | undefined>();
    const { eraseConfig } = useConfigStore((state) => state);
    const earseModeRef = useRef<EraseMode>(eraseConfig.mode);
    const earseRadiusRef = useRef<number>(eraseConfig.radius);
    const earseLog = useRef<LogGroup>([]);
    const earseAreaCurves = useRef<Array<{ origin: Curve; earsed: Curve; isModified: boolean }>>([]);
    const { removeCurve, removeCurvesWithPath } = useCurve();
    const {
        view2BubbleWithVector2D,
        removeBubble,
        getChildBubbles,
        getDescendantBubbles,
        getRatioWithCamera,
        identifyTouchRegion,
    } = useBubble();

    /* logs */
    const { pushLog } = useLog();

    useEffect(() => {
        useConfigStore.subscribe(({ eraseConfig }) => {
            earseModeRef.current = eraseConfig.mode;
            earseRadiusRef.current = eraseConfig.radius;
        });
    }, []);

    const startErase = useCallback((cameraView: ViewCoord) => {
        earseLog.current = [];
        // TODO 영역지우개일때 log 반영
        if (earseModeRef.current == 'area') {
            const descendants = getDescendantBubbles(cameraView.path);
            earseAreaCurves.current = descendants.flatMap((descendant) =>
                descendant.curves.map((curve) => {
                    return { origin: { ...curve }, earsed: curve, isModified: false };
                }),
            );
        }
    }, []);

    const erase = useCallback((cameraView: ViewCoord, currentPosition: Vector2D) => {
        if (earseModeRef.current == 'area') eraseArea(cameraView, currentPosition);
        else if (earseModeRef.current == 'stroke') eraseStroke(cameraView, currentPosition);
        else {
            const { region, bubble } = identifyTouchRegion(cameraView, currentPosition);
            if (region == 'inside' && bubble) {
                eraseBubble(bubble);
            }
        }
    }, []);

    const endErase = useCallback(() => {
        if (earseLog.current.length == 0) return;
        pushLog([...earseLog.current]);
    }, []);

    const eraseArea = (cameraView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;

        // 카메라뷰 밑 버블 가져오기
        const descendants = getDescendantBubbles(cameraView.path);
        // 버블에 있는 커브마다 지우개 설정(local 좌표계로)
        const curveWithErasers = descendants.flatMap((descendant) => {
            return findIntersectCurves(
                descendant.curves.map((curve) => {
                    const position = view2Point(currentPosition, cameraView);
                    const pos = view2BubbleWithVector2D(position, cameraView, descendant.path);
                    const scale = (getRatioWithCamera(descendant, cameraView) ?? 1) * 2;
                    return {
                        path: descendant.path,
                        curve: curve,
                        eraser: {
                            center: {
                                x: pos.x,
                                y: pos.y,
                            },
                            radius: earseRadiusRef.current / scale,
                        },
                    };
                }),
            );
        });

        // 지워주면 됨 => log가 생기면 log씌움
        curveWithErasers.forEach(({ path, curve, eraser }) => {
            const temp = markCurveWithEraser(eraser, curve);
            // removeCurve(path, curve);
            // addCurve(path, temp);
            // TODO update curve
            pushLog([
                { type: 'delete', object: curve, options: { path: path } },
                { type: 'create', object: temp, options: { path: path } },
            ]);
        });
    };

    const eraseStroke = (cameraView: ViewCoord, currentPosition: Vector2D) => {
        positionRef.current = currentPosition;

        // 카메라뷰 밑 버블 가져오기
        const descendants = getDescendantBubbles(cameraView.path);
        // 버블에 있는 커브마다 지우개 설정(local 좌표계로)
        const curveWithErasers = descendants.flatMap((descendant) => {
            return findIntersectCurves(
                descendant.curves.map((curve) => {
                    const position = view2Point(currentPosition, cameraView);
                    const pos = view2BubbleWithVector2D(position, cameraView, descendant.path);
                    const scale = (getRatioWithCamera(descendant, cameraView) ?? 1) * 2;
                    return {
                        path: descendant.path,
                        curve: curve,
                        eraser: {
                            center: {
                                x: pos.x,
                                y: pos.y,
                            },
                            radius: earseRadiusRef.current * scale,
                        },
                    };
                }),
            );
        });

        curveWithErasers.forEach(({ path, curve, eraser }) => {
            if (isIntersectCurveWithEraser(eraser, curve)) {
                removeCurve(path, curve);
                earseLog.current = [...earseLog.current, { type: 'delete', object: curve, options: { path: path } }];
            }
        });
    };

    const eraseBubble = (bubble: Bubble) => {
        // TODO 경고 창 띄우고 지우기
        // setEraseMode('area');

        const eraseLog: LogGroup = [];
        const ereaseChildBubble = (bubble: Bubble) => {
            const children = getChildBubbles(bubble.path);
            eraseLog.push({
                type: 'delete',
                object: bubble,
                options: {
                    childrenPaths: children.map((child) => child.path),
                },
            });
            children.forEach((child) => {
                ereaseChildBubble(child);
            });
            removeCurvesWithPath(bubble.path);
            removeBubble(bubble);
        };
        ereaseChildBubble(bubble);
        // TODO  한 번에 삭제 추가할 수 있도록 할 것
        // removeBubble(bubble);
        pushLog(eraseLog);
    };

    const findIntersectCurves = (curveWithErasers: Array<CurveAndEraser>): Array<CurveAndEraser> => {
        return curveWithErasers.filter(({ curve, eraser }) => {
            const rect = curve2Rect(curve.position);
            if (rect) return isCollisionRectWithCircle(rect, eraser);
            return false;
        });
    };

    const isIntersectCurveWithEraser = (circle: Circle, curve: Curve): boolean => {
        // TODO 두께 고려한 지우기, radius 보정 필요
        const points = curve.position;
        for (let i = 0; i < points.length - 1; i++) {
            if (isCollisionCapsuleWithCircle({ p1: points[i], p2: points[i + 1], radius: circle.radius }, circle)) {
                return true;
            }
        }
        return false;
    };

    /**
     * marked at control points which is invisible
     */
    const markCurveWithEraser = (circle: Circle, curve: Curve): Curve => {
        const { config } = curve;

        // TODO 두께 고려한 지우기, radius 보정 필요
        const points = curve.position;
        for (let i = 0; i < points.length - 1; i++) {
            if (isCollisionCapsuleWithCircle({ p1: points[i], p2: points[i + 1], radius: 5 }, circle)) {
                curve.position[i].isVisible = false;
            }
        }
        return {
            config: config,
            position: curve.position,
            isVisible: curve.isVisible,
            id: curve.id,
            isSelected: curve.isSelected,
        };
    };

    return { startErase, erase, endErase, eraseBubble, earseRadiusRef };
};
