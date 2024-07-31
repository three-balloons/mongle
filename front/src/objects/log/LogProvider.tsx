import { useBubble } from '@/objects/bubble/useBubble';
import { useCurve } from '@/objects/curve/useCurve';
import { isBubble, isCurve } from '@/util/shapes/typeGuard';
import { createContext, useReducer } from 'react';

export type LogContextProps = {
    isUndoAvailable: boolean;
    isRedoAvailable: boolean;
    undo: () => void;
    redo: () => void;
    pushLog: (log: LogElement) => void;
};

export const LogContext = createContext<LogContextProps | undefined>(undefined);

type LogProviderProps = {
    children: React.ReactNode;
};
type LogElement = {
    type: 'update' | 'create' | 'delete';
    object: Bubble | Curve;
};

type LogState = {
    logStack: Array<LogElement>;
    redoStack: Array<LogElement>;
};

export type LogAction = { type: 'UNDO' } | { type: 'REDO' } | { type: 'PUSH_LOG'; payload: { log: LogElement } };

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
    const { addBubble, removeBubble } = useBubble();
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
        const log = state.logStack[state.logStack.length - 1];
        console.log(log, 'log');
        if (log.type == 'create') {
            if (isBubble(log.object)) removeBubble(log.object);
            else if (isCurve(log.object)) removeCurve(log.object);
        } else if (log.type == 'delete') {
            if (isBubble(log.object)) addBubble(log.object);
            else if (isCurve(log.object)) addCurve(log.object);
        }
        dispatch({ type: 'UNDO' });
    };

    /**
     * 실행 취소 되돌리기
     */
    const redo = () => {
        if (state.redoStack.length == 0) return;
        const log = state.redoStack[state.redoStack.length - 1];
        console.log(log, 'log');
        if (log.type == 'create') {
            if (isBubble(log.object)) addBubble(log.object);
            else if (isCurve(log.object)) addCurve(log.object);
        } else if (log.type == 'delete') {
            if (isBubble(log.object)) removeBubble(log.object);
            else if (isCurve(log.object)) removeCurve(log.object);
        }
        dispatch({ type: 'REDO' });
    };

    const pushLog = (log: LogElement) => {
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
