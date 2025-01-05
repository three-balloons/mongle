import { createStoreWithPersist } from '@/store/store';

type State = {
    accessToken: string | null;
    isDemo: boolean;
    needTutorial: boolean;
};

type Action = {
    login: (accessToken: string) => void;
    logout: () => void;
    loginWithDemo: () => void;
    showTutorial: () => void;
};
type Store = State & Action;

export const useAuthStore = createStoreWithPersist<Store, State>(
    (set) => ({
        accessToken: null,
        isDemo: false,
        needTutorial: true,
        login: (accessToken) => set({ accessToken: accessToken, isDemo: false }),
        loginWithDemo: () => set({ accessToken: null, isDemo: true }),
        logout: () => set({ accessToken: null }),
        showTutorial: () => set({ needTutorial: false }),
    }),
    {
        name: 'authStorage',
        partialize: (state) => ({
            accessToken: state.accessToken,
            isDemo: state.isDemo,
            needTutorial: state.needTutorial,
        }),
    },
);

export const getAccessToken = () => {
    const token = useAuthStore.getState().accessToken;

    if (token == null) throw new Error('로그인이 필요합니다.');
    return token;
};
