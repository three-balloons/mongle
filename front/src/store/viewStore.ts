import { createStore } from '@/store/store';

type State = {
    canvasView: ViewCoord;
};

type Action = {
    setCanvasView: (canvasView: ViewCoord) => void;
};
type Store = State & Action;

export const useViewStore = createStore<Store, State>(
    (set) => ({
        canvasView: {
            pos: {
                top: -50,
                left: -50,
                width: 100,
                height: 100,
            },
            path: '/',
            size: { x: 100, y: 100 },
        },
        setCanvasView: (canvasView) => set({ canvasView: canvasView }),
    }),
    {
        name: 'viewStorage',
        partialize: (state) => ({ canvasView: state.canvasView }),
    },
);
