import { createStore } from '@/store/store';

type State = {
    accessToken: string | null;
    isDemo: boolean;
};

type Action = {
    login: (accessToken: string) => void;
    logout: () => void;
    loginWithDemo: () => void;
};
type Store = State & Action;

export const useAuthStore = createStore<Store, State>(
    (set) => ({
        accessToken: null,
        isDemo: false,
        login: (accessToken) => set({ accessToken: accessToken, isDemo: false }),
        loginWithDemo: () => set({ accessToken: null, isDemo: true }),
        logout: () => set({ accessToken: null }),
    }),
    {
        name: 'authStorage',
        partialize: (state) => ({ accessToken: state.accessToken, isDemo: state.isDemo }),
    },
);

export const getAccessToken = () => {
    const token = useAuthStore.getState().accessToken;

    if (token == null) throw new Error('로그인이 필요합니다.');
    return token;
};
