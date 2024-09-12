import { createStore } from '@/store/store';

type State = {
    cameraView: ViewCoord;
    /** 서버에서 정보를 다 받아 보여줄 준비가 되었는지 여부, 받기 시작전 false => 다 받으면 true */
    isReadyToShow: boolean;
};

type Action = {
    setCameraView: (cameraView: ViewCoord) => void;
    setIsReadyToShow: (isReadyToShow: boolean) => void;
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
        isReadyToShow: false,
        setCameraView: (cameraView) => set({ cameraView: cameraView }),
        setIsReadyToShow: (isReadyToShow) => set({ isReadyToShow: isReadyToShow }),
    }),
    {
        name: 'viewStorage',
        partialize: (state) => ({ cameraView: state.cameraView, isReadyToShow: state.isReadyToShow }),
    },
);
