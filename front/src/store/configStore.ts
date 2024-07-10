import { createStore } from '@/store/store';

type State = {
    penConfig: PenConfig;
    textConfig: TextConfig;
};

type Action = {
    setPenColor: (color: Color) => void;
    setPenThickness: (thickness: number) => void;
    setPenAlpha: (alpha: number) => void;
    setPenFont: (font: Font) => void;
};
type Store = State & Action;

export const useConfigStore = createStore<Store, State>(
    (set) => ({
        penConfig: {
            color: 'black',
            thickness: 5,
            alpha: 1,
        },
        textConfig: {
            fontSize: 48,
            fontWeight: 'normal',
            font: 'serif',
        },
        setPenColor: (color) =>
            set((state) => ({
                penConfig: {
                    ...state.penConfig,
                    color: color,
                },
            })),
        setPenThickness: (thickness) =>
            set((state) => ({
                penConfig: {
                    ...state.penConfig,
                    thickness,
                },
            })),
        setPenAlpha: (alpha) =>
            set((state) => ({
                penConfig: {
                    ...state.penConfig,
                    alpha,
                },
            })),
        setPenFont: (font) =>
            set((state) => ({
                penConfig: {
                    ...state.penConfig,
                    font,
                },
            })),
    }),
    {
        name: 'configStorage',
        partialize: (state) => ({ penConfig: state.penConfig, textConfig: state.textConfig }),
    },
);
