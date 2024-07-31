import { createStore } from '@/store/store';

type State = {
    cameraView: ViewCoord;
};

type Action = {
    setCameraView: (cameraView: ViewCoord) => void;
};
type Store = State & Action;

export const useViewStore = createStore<Store, State>(
    (set) => ({
        cameraView: {
            pos: {
                top: -50,
                left: -50,
                width: 100,
                height: 100,
            },
            path: '/',
            size: { x: 100, y: 100 },
        },
        setCameraView: (cameraView) => set({ cameraView: cameraView }),
    }),
    {
        name: 'viewStorage',
        partialize: (state) => ({ cameraView: state.cameraView }),
    },
);
