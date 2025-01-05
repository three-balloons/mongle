import { useLogSender } from '@/hooks/useLogSender';
import { useCamera } from '@/objects/camera/useCamera';
import { useCurve } from '@/objects/curve/useCurve';
import { useBubbleStore } from '@/store/bubbleStore';
import { useLogStore } from '@/store/useLogStore';
import { isLogBubble, isLogCamera, isLogCurve } from '@/util/typeGuard';
import { createContext, useRef } from 'react';

export type LogContextProps = {
    undo: () => void;
    redo: () => void;
    commitLog: () => void;
    addBubbleCreationLog: (bubble: Bubble, childrenPaths?: string[]) => void;
    addBubbleDeletionLog: (bubble: Bubble, childrenPaths?: string[]) => void;
    addBubbleUpdateLog: (
        originBubble: Bubble,
        modifiedBubble: Bubble,
        originChildrenPaths?: string[],
        modifiedBubblePath?: string[],
    ) => void;
    addCurveCreationLog: (curve: Curve, path: string) => void;
    addCurveDeletionLog: (curve: Curve, path: string) => void;
    addCurveUpdateLog: (originCurve: Curve, modifiedCurve: Curve, originPath: string, modifiedPath: string) => void;
    addCameraUpdateLog: (originCameraView: ViewCoord, modifiedCameraView: ViewCoord) => void;
};

export const LogContext = createContext<LogContextProps | undefined>(undefined);

type LogProviderProps = {
    children: React.ReactNode;
};

// deep copy해도 됨
const getInverseLog = (log: LogElement): LogElement => {
    switch (log.type) {
        case 'create':
            return {
                type: 'delete',
                modified: { ...log.modified, object: { ...log.modified.object } } as LogBubble | LogCurve,
            };
        case 'delete':
            return {
                type: 'create',
                modified: { ...log.modified, object: { ...log.modified.object } } as LogBubble | LogCurve,
            };
        case 'update': // path 변경 없는 경우, 크기 등만 변함
            return {
                type: 'update',
                modified: { ...log.origin, object: { ...log.origin.object } },
                origin: { ...log.modified, object: { ...log.modified.object } },
            };
        default:
            throw new Error(`Unsupported log type`);
    }
};

/**
 * update
 * => 이전 object를 저장 => 교체
 *
 * create
 * => 만든 object를 저장 => 삭제
 *
 * delete
 * => 삭제한 object를 저장 => 복구
 *
 * move
 * => 이동한 cameraView를 저장 교체
 *
 */
export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
    const addBubble = useBubbleStore((state) => state.addBubble);
    const removeBubble = useBubbleStore((state) => state.removeBubble);
    const { commitToServer } = useLogSender();
    const { addCurve, removeCurve } = useCurve();
    const { updateCameraView } = useCamera();
    const { undoLog, redoLog, pushLog, isRollbackNeeded, decreaseCheckpoint } = useLogStore();

    const uncommitedLogsRef = useRef<Array<LogElement>>([]);

    /**
     * 실행 취소
     * create, delete: modified 역연산
     * update, move: modified => origin
     */
    const undo = () => {
        const logs = undoLog();
        if (!logs) return;
        if (isRollbackNeeded()) {
            logs.forEach((log) => commitToServer(getInverseLog(log)));
            decreaseCheckpoint();
        }
        logs.forEach((log) => {
            switch (log.type) {
                case 'create':
                    if (isLogBubble(log)) {
                        removeBubble(log.modified.object);
                    } else if (isLogCurve(log)) {
                        removeCurve(log.modified.path, log.modified.object);
                    }
                    break;
                case 'delete':
                    if (isLogBubble(log)) addBubble(log.modified.object, log.modified.childrenPaths);
                    else if (isLogCurve(log)) addCurve(log.modified.path, log.modified.object);
                    break;
                case 'update': // path 변경 없는 경우, 크기 등만 변함
                    if (isLogBubble(log)) {
                        // 제거 후 생성하는 방식
                        removeBubble(log.modified.object);
                        addBubble(log.origin.object, log.origin.childrenPaths);
                    } else if (isLogCurve(log)) {
                        removeCurve(log.modified.path, log.modified.object);
                        addCurve(log.origin.path, log.origin.object);
                    } else if (isLogCamera(log)) {
                        updateCameraView(log.origin.object, log.modified.object);
                    }
                    break;
                default:
                    break;
            }
        });
    };

    /**
     * 실행 취소 되돌리기
     * create, delete: modified 그대로
     * update, move: origin => modified
     */
    const redo = () => {
        const logs = redoLog();
        if (!logs) return;

        logs.forEach((log) => {
            switch (log.type) {
                case 'create':
                    if (isLogBubble(log)) {
                        addBubble(log.modified.object, log.modified.childrenPaths);
                    } else if (isLogCurve(log)) {
                        addCurve(log.modified.path, log.modified.object);
                    }
                    break;
                case 'delete':
                    if (isLogBubble(log)) removeBubble(log.modified.object);
                    else if (isLogCurve(log)) removeCurve(log.modified.path, log.modified.object);
                    break;
                case 'update':
                    if (isLogBubble(log)) {
                        // 제거 후 생성하는 방식
                        removeBubble(log.origin.object);
                        addBubble(log.modified.object, log.modified.childrenPaths ?? []);
                    } else if (isLogCurve(log)) {
                        removeCurve(log.origin.path, log.origin.object);
                        addCurve(log.modified.path, log.modified.object);
                    } else if (isLogCamera(log)) {
                        updateCameraView(log.modified.object, log.origin.object);
                    }
                    break;
                default:
                    break;
            }
        });
    };

    const commitLog = () => {
        console.log('log commit');
        pushLog(uncommitedLogsRef.current);
        uncommitedLogsRef.current = [];
    };

    const addBubbleCreationLog = (bubble: Bubble, childrenPaths?: string[]) => {
        uncommitedLogsRef.current = [
            ...uncommitedLogsRef.current,
            { type: 'create', modified: { object: bubble, childrenPaths: childrenPaths ?? [] } },
        ];
    };

    const addBubbleDeletionLog = (bubble: Bubble, childrenPaths?: string[]) => {
        uncommitedLogsRef.current = [
            ...uncommitedLogsRef.current,
            { type: 'delete', modified: { object: bubble, childrenPaths: childrenPaths ?? [] } },
        ];
    };

    const addBubbleUpdateLog = (
        originBubble: Bubble,
        modifiedBubble: Bubble,
        originChildrenPaths?: string[],
        modifiedBubblePath?: string[],
    ) => {
        uncommitedLogsRef.current = [
            ...uncommitedLogsRef.current,
            {
                type: 'update',
                modified: { object: modifiedBubble, childrenPaths: modifiedBubblePath ?? [] },
                origin: { object: originBubble, childrenPaths: originChildrenPaths ?? [] },
            },
        ];
    };

    const addCurveCreationLog = (curve: Curve, path: string) => {
        uncommitedLogsRef.current = [
            ...uncommitedLogsRef.current,
            { type: 'create', modified: { object: curve, path: path } },
        ];
    };

    const addCurveDeletionLog = (curve: Curve, path: string) => {
        uncommitedLogsRef.current = [
            ...uncommitedLogsRef.current,
            { type: 'delete', modified: { object: curve, path: path } },
        ];
    };

    const addCurveUpdateLog = (originCurve: Curve, modifiedCurve: Curve, originPath: string, modifiedPath: string) => {
        uncommitedLogsRef.current = [
            ...uncommitedLogsRef.current,
            {
                type: 'update',
                modified: { object: modifiedCurve, path: modifiedPath },
                origin: { object: originCurve, path: originPath },
            },
        ];
    };

    const addCameraUpdateLog = (originCameraView: ViewCoord, modifiedCameraView: ViewCoord) => {
        uncommitedLogsRef.current = [
            ...uncommitedLogsRef.current,
            {
                type: 'update',
                modified: { object: modifiedCameraView },
                origin: { object: originCameraView },
            },
        ];
    };

    return (
        <LogContext.Provider
            value={{
                undo,
                redo,
                commitLog,
                addBubbleCreationLog,
                addBubbleDeletionLog,
                addBubbleUpdateLog,
                addCurveCreationLog,
                addCurveDeletionLog,
                addCurveUpdateLog,
                addCameraUpdateLog,
            }}
        >
            {children}
        </LogContext.Provider>
    );
};
