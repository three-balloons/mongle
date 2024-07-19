import { createContext, useRef } from 'react';

export type BubbleContextProps = {
    getBubbles: () => Array<Bubble>;
    getCreatingBubble: () => Rect;
    addBubble: (bubble: Bubble) => void;
    updateCreatingBubble: (rect: Rect) => void;
};

export const BubbleContext = createContext<BubbleContextProps | undefined>(undefined);

type BubbleProviderProps = {
    children: React.ReactNode;
    sensitivity?: number;
};

export const BubbleProvider: React.FC<BubbleProviderProps> = ({ children }) => {
    const bubblesRef = useRef<Array<Bubble>>([]);
    const creatingBubbleRef = useRef<Rect>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    const updateCreatingBubble = (rect: Rect) => {
        creatingBubbleRef.current = rect;
    };

    const getCreatingBubble = () => {
        return creatingBubbleRef.current;
    };
    const getBubbles = () => {
        return [...bubblesRef.current];
    };

    const addBubble = (bubble: Bubble) => {
        bubblesRef.current = [...bubblesRef.current, bubble];
    };

    return (
        <BubbleContext.Provider
            value={{
                getBubbles,
                getCreatingBubble,
                addBubble,
                updateCreatingBubble,
            }}
        >
            {children}
        </BubbleContext.Provider>
    );
};
