import { createStoreWithPersist } from '@/store/store';

type CursorType = 'pen' | 'eraser' | 'none' | 'move' | 'grab' | 'edit' | 'add';

type State = {
    cursor: CursorType;
};

type Action = {
    setCursor: (cursor: CursorType) => void;
};
type Store = State & Action;

export const useCursorStore = createStoreWithPersist<Store, State>(
    (set) => ({
        cursor: 'pen',
        focusBubblePath: undefined,

        setCursor: (cursor) =>
            set({
                cursor: cursor,
            }),
    }),
    {
        name: 'cursorStorage',
        partialize: (state) => ({
            cursor: state.cursor,
        }),
    },
);
