import { createStoreWithPersist } from '@/store/store';

type State = {
    currentWorkspaceId: string;
    logs: Record<
        string,
        {
            redoStack: Array<LogGroup>;
            undoStack: Array<LogGroup>;
            checkpoint: number;
            isUndoAvailable: boolean;
            isRedoAvailable: boolean;
        }
    >;
};

type Action = {
    setCurrentWorkspaceId: (workspaceId: string) => void;
    pushLog: (log: LogGroup) => void;
    undoLog: () => LogGroup | undefined;
    redoLog: () => LogGroup | undefined;
    setCheckpoint: (checkpoint: number) => void;
    decreaseCheckpoint: () => void;
    isRollbackNeeded: () => boolean;
    getIsUndoAvailable: () => boolean;
    getIsRedoAvailable: () => boolean;
    clearAllLog: () => void;
};
type Store = State & Action;

export const useLogStore = createStoreWithPersist<Store, Partial<State>>(
    (set, get) => ({
        currentWorkspaceId: '',
        logs: {},
        // redoStack: [],
        // undoStack: [],
        // checkpoint: 0,
        // isUndoAvailable: false,
        // isRedoAvailable: false,
        setCurrentWorkspaceId: (workspaceId) =>
            set((state) => {
                if (!state.logs[workspaceId]) {
                    state.logs[workspaceId] = {
                        redoStack: [],
                        undoStack: [],
                        checkpoint: 0,
                        isUndoAvailable: false,
                        isRedoAvailable: false,
                    };
                }
                return { currentWorkspaceId: workspaceId };
            }),
        pushLog: (log) => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return;
            const workspaceLogs = {
                redoStack: [...logs[currentWorkspaceId].redoStack, log],
                undoStack: [],
                checkpoint: logs[currentWorkspaceId].checkpoint,
                isRedoAvailable: false,
                isUndoAvailable: true,
            };
            set((state) => {
                return {
                    logs: {
                        ...state.logs,
                        [currentWorkspaceId]: workspaceLogs,
                    },
                };
            });
        },
        undoLog: () => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return;
            const { redoStack, undoStack, checkpoint } = logs[currentWorkspaceId];
            if (redoStack.length === 0) return undefined;

            const lastRedoLog = redoStack[redoStack.length - 1];
            const newRedoStack = redoStack.slice(0, -1);
            const workspaceLogs = {
                redoStack: newRedoStack,
                undoStack: [...undoStack, lastRedoLog],
                checkpoint: checkpoint,
                isRedoAvailable: true,
                isUndoAvailable: newRedoStack.length >= 1,
            };
            set((state) => {
                return {
                    logs: {
                        ...state.logs,
                        [currentWorkspaceId]: workspaceLogs,
                    },
                };
            });
            return lastRedoLog;
        },
        redoLog: () => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return;
            const { redoStack, undoStack, checkpoint } = logs[currentWorkspaceId];
            if (undoStack.length === 0) return undefined;
            const lastUndoLog = undoStack[undoStack.length - 1];
            const newUndoStack = undoStack.slice(0, -1);

            const workspaceLogs = {
                redoStack: [...redoStack, lastUndoLog],
                undoStack: newUndoStack,
                checkpoint: checkpoint,
                isRedoAvailable: newUndoStack.length >= 1,
                isUndoAvailable: true,
            };
            set((state) => {
                return {
                    logs: {
                        ...state.logs,
                        [currentWorkspaceId]: workspaceLogs,
                    },
                };
            });
            return lastUndoLog;
        },
        setCheckpoint: (checkpoint) => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return;
            const workspaceLogs = {
                ...logs[currentWorkspaceId],
                checkpoint: checkpoint,
            };
            set((state) => {
                return {
                    logs: {
                        ...state.logs,
                        [currentWorkspaceId]: workspaceLogs,
                    },
                };
            });
        },
        decreaseCheckpoint: () => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return;
            const { checkpoint } = logs[currentWorkspaceId];
            const workspaceLogs = {
                ...logs[currentWorkspaceId],
                checkpoint: checkpoint > 0 ? checkpoint - 1 : 0,
            };
            set((state) => {
                return {
                    logs: {
                        ...state.logs,
                        [currentWorkspaceId]: workspaceLogs,
                    },
                };
            });
        },
        isRollbackNeeded: () => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return false;
            const { checkpoint, redoStack } = logs[currentWorkspaceId];
            return checkpoint > redoStack.length;
        },
        getIsUndoAvailable: () => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return false;
            return logs[currentWorkspaceId].isUndoAvailable;
        },
        getIsRedoAvailable: () => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return false;
            return logs[currentWorkspaceId].isRedoAvailable;
        },
        clearAllLog: () => {
            const { logs, currentWorkspaceId } = get();
            if (!logs[currentWorkspaceId]) return;
            set((state) => {
                return {
                    logs: {
                        ...state.logs,
                        [currentWorkspaceId]: {
                            redoStack: [],
                            undoStack: [],
                            checkpoint: 0,
                            isRedoAvailable: false,
                            isUndoAvailable: false,
                        },
                    },
                };
            });
        },
    }),
    {
        name: 'logStorage',
        partialize: (state) => ({
            currentWorkspaceId: state.currentWorkspaceId,
            logs: state.logs,
        }),
    },
);
