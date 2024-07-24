import { bubble2Vector2D } from '@/util/coordSys/conversion';
import { getParentPath, getPathDifferentDepth } from '@/util/path/path';
import { createContext, useRef } from 'react';

export type BubbleContextProps = {
    clearAllBubbles: () => void;
    getBubbles: () => Array<Bubble>;
    getCreatingBubble: () => Rect;
    addBubble: (bubble: Bubble) => void;
    updateCreatingBubble: (rect: Rect) => void;
    findBubble: (path: string) => Bubble | undefined;
    descendant2child: (descendant: Bubble, ancestorPath: string) => Bubble | undefined;
    view2BubbleWithVector2D: (pos: Vector2D, canvasView: ViewCoord, bubblePath: string) => Vector2D;
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

    const clearAllBubbles = () => {
        bubblesRef.current = [];
    };

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

    const findBubble = (path: string): Bubble | undefined => {
        if (path == '/') return undefined;
        return bubblesRef.current.find((bubble) => bubble.path == path);
    };

    /**
     * 실제 View 위의 좌표를 bubble 내의 좌표로 변환
     */
    const view2BubbleWithVector2D = (pos: Vector2D, canvasView: ViewCoord, bubblePath: string) => {
        let ret = { ...pos };

        const bubble = findBubble(bubblePath);
        if (bubble) {
            const bubbleView = descendant2child(bubble, canvasView.path);
            ret = bubble2Vector2D(ret, bubbleView);
        }
        return ret;
    };

    /**
     * 자손버블좌표계에서 자식버블좌표계로 변환
     *
     * 사용처: 버블 이동, 내부의 요소를 canvasView로 변환하기 위한 사전 작업
     *
     * TODO: 최적화, useBubble에 의존하고 있음 => 의존성 제거 혹은 계산부분 분리 필요
     */
    const descendant2child = (descendant: Bubble, ancestorPath: string): Bubble | undefined => {
        const depth = getPathDifferentDepth(ancestorPath, descendant.path);
        if (depth == undefined) return undefined;
        if (depth == 0) return descendant; // depth가 0인 경우 자체가 존재하지 않음
        if (depth == 1)
            return descendant; // descendant is child
        else if (depth > 1) {
            const ret: Bubble = { ...descendant };
            let parent: Bubble | undefined = ret;
            for (let i = 1; i < depth; i++) {
                const path = getParentPath(ret.path);
                if (path == undefined) return undefined;
                parent = findBubble(path);
                if (parent == undefined) return undefined;
                ret.path = parent.path;
                ret.top = (parent.height * (100 + ret.top)) / 200 + parent.top;
                ret.left = (parent.width * (100 + ret.left)) / 200 + parent.left;
                ret.height = (parent.height * ret.height) / 200;
                ret.width = (parent.width * ret.width) / 200;
            }
            return ret;
        }
    };

    return (
        <BubbleContext.Provider
            value={{
                clearAllBubbles,
                getBubbles,
                getCreatingBubble,
                addBubble,
                updateCreatingBubble,
                findBubble,
                descendant2child,
                view2BubbleWithVector2D,
            }}
        >
            {children}
        </BubbleContext.Provider>
    );
};
