import { createStoreWithPersist } from '@/store/store';

type State = {
    redoStack: Array<LogGroup>;
    undoStack: Array<LogGroup>;
    isUndoAvailable: boolean;
    isRedoAvailable: boolean;
};

type Action = {
    pushLog: (log: LogGroup) => void;
    undoLog: () => LogGroup | undefined;
    redoLog: () => LogGroup | undefined;
};
type Store = State & Action;

export const useLogStore = createStoreWithPersist<Store, Partial<State>>(
    (set, get) => ({
        redoStack: [],
        undoStack: [],
        isUndoAvailable: false,
        isRedoAvailable: false,
        pushLog: (log) => {
            set({ redoStack: [...get().redoStack, log], undoStack: [], isRedoAvailable: false, isUndoAvailable: true });
        },
        undoLog: () => {
            const { redoStack, undoStack } = get();
            if (redoStack.length === 0) return undefined;
            const lastRedoLog = redoStack[redoStack.length - 1];
            const newRedoStack = redoStack.slice(0, -1);
            set({
                redoStack: newRedoStack,
                undoStack: [...undoStack, lastRedoLog],
                isRedoAvailable: true,
                isUndoAvailable: newRedoStack.length >= 1,
            });
            return lastRedoLog;
        },
        redoLog: () => {
            const { redoStack, undoStack } = get();
            if (undoStack.length === 0) return undefined;
            const lastUndoLog = undoStack[undoStack.length - 1];
            const newUndoStack = undoStack.slice(0, -1);
            set({
                redoStack: [...redoStack, lastUndoLog],
                undoStack: newUndoStack,
                isRedoAvailable: newUndoStack.length >= 1,
                isUndoAvailable: true,
            });
            return lastUndoLog;
        },
    }),
    {
        name: 'logStorage',
        partialize: (state) => ({
            redoStack: state.redoStack,
            undoStack: state.undoStack,
            isUndoAvailable: state.isUndoAvailable,
            isRedoAvailable: state.isRedoAvailable,
        }),
    },
);
