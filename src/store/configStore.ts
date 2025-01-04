import { createStoreWithPersist } from '@/store/store';

type State = {
    penConfig: PenConfig;
    eraseConfig: EraseConfig;
    textConfig: TextConfig;
    mode: ControlMode;
    isShowAnimation: boolean;
    isShowBubble: boolean;
    isTouchDraw: boolean;
};

type Action = {
    setPenColor: (color: Color) => void;
    setPenThickness: (thickness: number) => void;
    setPenAlpha: (alpha: number) => void;
    setPenFont: (font: Font) => void;
    setEraseMode: (eraseMode: EraseMode) => void;
    setEraseRadius: (radius: number) => void;
    setMode: (mode: ControlMode) => void;
    setIsShowAnimation: (isShowAnimation: boolean) => void;
    setIsShowBubble: (isShowBubble: boolean) => void;
    setIsTouchDraw: (isTouchDraw: boolean) => void;
};
type Store = State & Action;

export const useConfigStore = createStoreWithPersist<Store, State>(
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
        eraseConfig: {
            radius: 20,
            mode: 'area',
        },
        mode: 'move',
        isShowAnimation: true,
        isShowBubble: true,
        isTouchDraw: false,
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
        setEraseMode: (eraseMode) =>
            set((state) => ({
                eraseConfig: {
                    ...state.eraseConfig,
                    mode: eraseMode,
                },
            })),
        setEraseRadius: (radius) =>
            set((state) => ({
                eraseConfig: {
                    ...state.eraseConfig,
                    radius: radius,
                },
            })),
        setMode: (mode) => set({ mode: mode }),
        setIsShowAnimation: (isShowAnimation) => set({ isShowAnimation: isShowAnimation }),
        setIsShowBubble: (isShowBubble) => set({ isShowBubble: isShowBubble }),
        setIsTouchDraw: (isTouchDraw) => set({ isTouchDraw: isTouchDraw }),
    }),
    {
        name: 'configStorage',
        partialize: (state) => ({
            penConfig: state.penConfig,
            textConfig: state.textConfig,
            eraseConfig: state.eraseConfig,
            mode: state.mode,
            isShowAnimation: state.isShowAnimation,
            isShowBubble: state.isShowBubble,
            isTouchDraw: state.isTouchDraw,
        }),
    },
);
