import { useBubble } from '@/objects/bubble/useBubble';
import { useCurve } from '@/objects/curve/useCurve';
import { isLogBubble, isLogCurve } from '@/util/typeGuard';
import { createContext, useReducer } from 'react';

export type LogContextProps = {
    isUndoAvailable: boolean;
    isRedoAvailable: boolean;
    undo: () => void;
    redo: () => void;
    pushLog: (log: LogGroup) => void;
};

export const LogContext = createContext<LogContextProps | undefined>(undefined);

type LogProviderProps = {
    children: React.ReactNode;
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

export type LogAction = { type: 'UNDO' } | { type: 'REDO' } | { type: 'PUSH_LOG'; payload: { log: LogGroup } };

const LogReducer = (state: LogState, action: LogAction): LogState => {
    switch (action.type) {
        case 'UNDO': {
            const obj = state.logStack[state.logStack.length - 1];
            const newLogStack = [...state.logStack];
            newLogStack.pop();
            return { logStack: newLogStack, redoStack: [...state.redoStack, obj] };
        }
        case 'REDO': {
            const obj = state.redoStack[state.redoStack.length - 1];
            const newRedoStack = [...state.redoStack];
            newRedoStack.pop();
            return { logStack: [...state.logStack, obj], redoStack: newRedoStack };
        }
        case 'PUSH_LOG': {
            return {
                ...state,
                logStack: [...state.logStack, action.payload.log],
            };
        }
        default:
            return state;
    }
};

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
    const { addBubble, removeBubble, getBubbles } = useBubble();
    const { addCurve, removeCurve } = useCurve();
    const [state, dispatch] = useReducer(LogReducer, {
        logStack: [],
        redoStack: [],
    });

    /**
     * 실행 취소
     */
    const undo = () => {
        if (state.logStack.length == 0) return;
        const logGroup = state.logStack[state.logStack.length - 1];
        logGroup.forEach((log) => {
            if (log.type == 'create') {
                if (isLogBubble(log)) {
                    removeBubble(log.object);
                } else if (isLogCurve(log)) removeCurve(log.options.path, log.object);
            } else if (log.type == 'delete') {
                if (isLogBubble(log)) addBubble(log.object, log.options.childrenPaths);
                else if (isLogCurve(log)) addCurve(log.options.path, log.object);
            }
            // else if (log.type == 'update') {
            //     if (isLogBubble(log)) {
            //         updateBubble(log.object.path, log.object);
            //     } else if (isLogCurve(log)) addCurve(log.options.path, log.object);
            // }
        });
        console.log(getBubbles());
        dispatch({ type: 'UNDO' });
        console.log(getBubbles());
    };

    /**
     * 실행 취소 되돌리기
     */
    const redo = () => {
        if (state.redoStack.length == 0) return;
        const logGroup = state.redoStack[state.redoStack.length - 1];
        logGroup.forEach((log) => {
            if (log.type == 'create') {
                if (isLogBubble(log)) {
                    addBubble(log.object, log.options.childrenPaths);
                } else if (isLogCurve(log)) addCurve(log.options.path, log.object);
            } else if (log.type == 'delete') {
                if (isLogBubble(log)) removeBubble(log.object);
                else if (isLogCurve(log)) removeCurve(log.options.path, log.object);
            }
        });

        dispatch({ type: 'REDO' });
    };

    const pushLog = (log: LogGroup) => {
        dispatch({ type: 'PUSH_LOG', payload: { log } });
    };

    return (
        <LogContext.Provider
            value={{
                isUndoAvailable: state.logStack.length !== 0,
                isRedoAvailable: state.redoStack.length !== 0,
                undo,
                redo,
                pushLog,
            }}
        >
            {children}
        </LogContext.Provider>
    );
};
