import { useEffect, useRef } from 'react';
// import { createBubbleAPI } from '@/api/bubble';
import { useMutation } from '@tanstack/react-query';
import { createBubbleAPI, deleteBubbleAPI, updateCurveAPI } from '@/api/bubble';
import { useLogStore } from '@/store/useLogStore';
import { isLogBubble, isLogCurve } from '@/util/typeGuard';

interface CurveMutationProps {
    workspaceId: string;
    bubblePath: string;
    curves: Array<Curve>;
}

interface BubbleMutationProps {
    workspaceId: string;
    bubble: Bubble;
}

export const useLogSender = () => {
    const { setCheckpoint, clearAllLog } = useLogStore();
    const workspaceIdRef = useRef(useLogStore.getState().currentWorkspaceId);

    useEffect(() => {
        const unsubscribeLogStore = useLogStore.subscribe(({ currentWorkspaceId }) => {
            workspaceIdRef.current = currentWorkspaceId;
        });

        return () => {
            unsubscribeLogStore();
        };
    }, []);

    /* Bubbles */
    const { mutate: createBubbleMutation } = useMutation({
        mutationFn: ({ workspaceId, bubble }: BubbleMutationProps) => createBubbleAPI({ workspaceId, bubble }),
    });

    const { mutate: deleteBubbleMutation } = useMutation({
        mutationFn: ({ workspaceId, bubble }: BubbleMutationProps) =>
            deleteBubbleAPI({ workspaceId, path: bubble.path, isCascade: true }),
    });

    // const { mutate: updateBubbleMutation } = useMutation({
    //     mutationFn: ({ workspaceId, bubble }: BubbleMutationProps) => updateBubbleAPI({ workspaceId, bubble }),
    // });

    /* Curves */
    const { mutate: createCurveMutation } = useMutation({
        mutationFn: ({ workspaceId, bubblePath, curves }: CurveMutationProps) =>
            updateCurveAPI({ workspaceId, bubblePath, createCurves: curves }),
    });

    const { mutate: updateCurveMutation } = useMutation({
        mutationFn: ({ workspaceId, bubblePath, curves }: CurveMutationProps) =>
            updateCurveAPI({ workspaceId, bubblePath, updateCurves: curves }),
    });

    const { mutate: deleteCurveMutation } = useMutation({
        mutationFn: ({ workspaceId, bubblePath, curves }: CurveMutationProps) =>
            updateCurveAPI({
                workspaceId,
                bubblePath,
                deleteCurves: curves
                    .filter((curve) => curve.id !== undefined)
                    .map((curve) => ({ id: curve.id as number })),
            }),
    });

    const sendLogsToServer = (isClearLog: boolean = false) => {
        const workspaceId = workspaceIdRef.current;
        if (!workspaceId || workspaceId == 'demo') return;
        const checkpoint = useLogStore.getState().logs[workspaceId].checkpoint;
        const logs: Array<LogGroup> = useLogStore.getState().logs[workspaceId].redoStack;
        let currentPoint = checkpoint;
        while (currentPoint < logs.length) {
            logs[currentPoint].forEach((log) => commitToServer(log));
            currentPoint++;
        }
        if (isClearLog) clearAllLog();
        else setCheckpoint(currentPoint);

        console.log('전송 완료!');
    };

    const commitToServer = (log: LogElement) => {
        const workspaceId = workspaceIdRef.current;
        if (!workspaceId || workspaceId == 'demo') return;
        switch (log.type) {
            case 'create':
                if (isLogBubble(log)) {
                    createBubbleMutation({ workspaceId: workspaceId, bubble: log.modified.object });
                } else if (isLogCurve(log)) {
                    createCurveMutation({
                        workspaceId: workspaceId,
                        bubblePath: log.modified.path,
                        curves: [log.modified.object],
                    });
                }
                break;
            case 'delete':
                if (isLogBubble(log)) {
                    deleteBubbleMutation({ workspaceId: workspaceId, bubble: log.modified.object });
                } else if (isLogCurve(log)) {
                    deleteCurveMutation({
                        workspaceId: workspaceId,
                        bubblePath: log.modified.path,
                        curves: [log.modified.object],
                    });
                }
                break;
            case 'update': // path 변경 없는 경우, 크기 등만 변함
                if (isLogBubble(log)) {
                    // // 제거 후 생성하는 방식
                    // removeBubble(log.modified.object);
                    // addBubble(log.origin.object, log.origin.childrenPaths);
                } else if (isLogCurve(log)) {
                    // TODO updateMutation반영 후 id 저장 필요
                    updateCurveMutation({
                        workspaceId: workspaceId,
                        bubblePath: log.modified.path,
                        curves: [log.modified.object],
                    });
                }
                break;
            default:
                break;
        }
    };

    return { sendLogsToServer, commitToServer };
};
