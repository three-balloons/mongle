import { getBubbleAPI } from '@/api/bubble';
import { bubbleTreeReducer } from '@/objects/bubble/bubbleTreeReducer';
import { useViewStore } from '@/store/viewStore';
import { BUBBLE_BORDER_WIDTH, RENDERED_FONT_SIZE } from '@/util/constant';
import { global2bubbleWithRect, global2bubbleWithVector2D, rect2View } from '@/util/coordSys/conversion';
import { getParentPath, getPathDepth, getPathDifferentDepth, pathToList } from '@/util/path/path';
import { isCollisionPointWithRect } from '@/util/shapes/collision';
import { useQuery } from '@tanstack/react-query';
import { createContext, useRef, useReducer, useEffect } from 'react';

export type BubbleContextProps = {
    setFocusBubblePath: (path: string | undefined) => void;
    getFocusBubblePath: () => string | undefined;

    /* 버블 */
    getCreatingBubble: () => Rect;
    setCreatingBubble: (rect: Rect) => void;
    clearAllBubbles: () => void;
    getBubbles: () => Array<Bubble>;
    addBubble: (bubble: Bubble, childrenPaths: Array<string>) => void;
    removeBubble: (bubble: Bubble) => void;
    updateBubble: (path: string, bubble: Bubble) => void;
    findBubble: (path: string) => Bubble | undefined;
    identifyTouchRegion: (
        cameraView: ViewCoord,
        position: Vector2D,
    ) => { region: 'inside' | 'outside' | 'border' | 'name'; bubble: Bubble | undefined };

    /* 좌표 변환 */
    descendant2child: (descendant: Bubble, ancestorPath: string) => Bubble | undefined;
    getRatioWithCamera: (bubble: Bubble, cameraView: ViewCoord) => number | undefined;
    view2BubbleWithVector2D: (pos: Vector2D, cameraView: ViewCoord, bubblePath: string) => Vector2D;
    view2BubbleWithRect: (rect: Rect, cameraView: ViewCoord, bubblePath: string) => Rect;

    /* 버블 트리 */
    bubbleTree: BubbleTreeNode;
    setBubbleTree: (bubbleTreeRoot: BubbleTreeNode) => void;
    getBubbleInTree: (bubble: Bubble) => BubbleTreeNode | undefined;
    getDescendantBubbles: (path: string) => Array<Bubble>;
    getChildBubbles: (path: string) => Array<Bubble>;
};

export const BubbleContext = createContext<BubbleContextProps | undefined>(undefined);

type BubbleProviderProps = {
    children: React.ReactNode;
    workspaceId: string;
    workspaceName?: string;
};
export const BubbleProvider: React.FC<BubbleProviderProps> = ({
    children,
    workspaceId,
    workspaceName = '제목없음',
}) => {
    const bubblesRef = useRef<Array<Bubble>>([]);
    const focusBubblePathRef = useRef<string | undefined>(undefined);
    const [state, dispatch] = useReducer(bubbleTreeReducer, {
        bubbleTree: {
            name: workspaceName,
            children: [],
            this: undefined,
            parent: undefined,
        },
    });
    const creatingBubbleRef = useRef<Rect>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });
    const { setIsReadyToShow } = useViewStore((state) => state);
    const isReadyToShowRef = useRef(false);
    useEffect(() => {
        setIsReadyToShow(false);
        useViewStore.subscribe(({ isReadyToShow }) => {
            isReadyToShowRef.current = isReadyToShow;
        });
    }, []);

    const bubbleQuery = useQuery({
        queryKey: ['bubbles'],
        queryFn: () => {
            if (workspaceId === 'demo') return [] as Array<Bubble>;
            else return getBubbleAPI(workspaceId, '/');
        },
    });

    const clearAllBubbles = () => {
        bubblesRef.current = [];
    };

    const setFocusBubblePath = (path: string | undefined) => {
        focusBubblePathRef.current = path;
    };

    const getFocusBubblePath = () => {
        return focusBubblePathRef.current;
    };

    const setCreatingBubble = (rect: Rect) => {
        creatingBubbleRef.current = rect;
    };

    const getCreatingBubble = () => {
        return creatingBubbleRef.current;
    };
    const getBubbles = () => {
        return [...bubblesRef.current];
    };

    const addBubble = (bubble: Bubble, childrenPaths: Array<string>) => {
        bubblesRef.current = [...bubblesRef.current, bubble];
        _addBubbleInTree(bubble, childrenPaths);
    };

    const removeBubble = (bubbleToRemove: Bubble) => {
        bubblesRef.current = [...bubblesRef.current.filter((bubble) => bubble !== bubbleToRemove)];
        _removeBubbleInTree(bubbleToRemove);
    };

    /**
     * path에 해당하는 bubble을 찾아 update(주소 변환 X)
     * @param path 변환시킬 bubble의 path
     * @param bubble 변환시킬 내용
     */
    const updateBubble = (path: string, bubble: Bubble) => {
        const remove = findBubble(path);
        const childrenPaths = getChildBubbles(path).map((child) => child.path);
        if (remove) removeBubble(remove);
        addBubble(bubble, childrenPaths);
    };

    const findBubble = (path: string): Bubble | undefined => {
        if (path == '/') return undefined;
        return bubblesRef.current.find((bubble) => bubble.path == path);
    };

    /**
     * 실제 View 위의 좌표를 bubble 내의 좌표로 변환
     */
    const view2BubbleWithVector2D = (pos: Vector2D, cameraView: ViewCoord, bubblePath: string) => {
        let ret = { ...pos };

        const bubble = findBubble(bubblePath);
        if (bubble) {
            const bubbleView = descendant2child(bubble, cameraView.path);
            ret = global2bubbleWithVector2D(ret, bubbleView);
        }
        return ret;
    };

    /**
     * 실제 View 위의 좌표를 bubble 내의 좌표로 변환
     */
    const view2BubbleWithRect = (rect: Rect, cameraView: ViewCoord, bubblePath: string) => {
        let ret = { ...rect };

        const bubble = findBubble(bubblePath);
        if (bubble) {
            const bubbleView = descendant2child(bubble, cameraView.path);
            ret = global2bubbleWithRect(ret, bubbleView);
        }
        return ret;
    };

    /**
     * 버블 안인지 밖인지 테두리인지 판단하는 함수
     */
    // TODO renaming
    const identifyTouchRegion = (
        cameraView: ViewCoord,
        position: Vector2D,
    ): { region: 'inside' | 'outside' | 'border' | 'name'; bubble: Bubble | undefined } => {
        const bubbles = bubblesRef.current;
        bubbles.sort((a, b) => getPathDepth(b.path) - getPathDepth(a.path));
        for (const bubble of bubbles) {
            if (!bubble.isVisible) continue;
            const bubbleView = descendant2child(bubble, cameraView.path);
            if (bubbleView) {
                const rect = rect2View(
                    {
                        top: bubbleView.top,
                        left: bubbleView.left,
                        width: bubbleView.width,
                        height: bubbleView.height,
                    },
                    cameraView,
                );
                if (
                    isCollisionPointWithRect(position, {
                        top: rect.top - RENDERED_FONT_SIZE,
                        left: rect.left,
                        width: bubble.nameSizeInCanvas,
                        height: RENDERED_FONT_SIZE,
                    })
                ) {
                    console.log('name touch');
                    return {
                        region: 'name',
                        bubble: bubble,
                    };
                } else if (
                    isCollisionPointWithRect(position, {
                        top: rect.top - BUBBLE_BORDER_WIDTH,
                        left: rect.left - BUBBLE_BORDER_WIDTH,
                        width: rect.width + BUBBLE_BORDER_WIDTH * 2,
                        height: rect.height + BUBBLE_BORDER_WIDTH * 2,
                    })
                )
                    if (
                        isCollisionPointWithRect(position, {
                            top: rect.top + BUBBLE_BORDER_WIDTH,
                            left: rect.left + BUBBLE_BORDER_WIDTH,
                            width: rect.width - BUBBLE_BORDER_WIDTH * 2,
                            height: rect.height - BUBBLE_BORDER_WIDTH * 2,
                        })
                    )
                        return {
                            region: 'inside',
                            bubble: bubble,
                        };
                    else
                        return {
                            region: 'border',
                            bubble: bubble,
                        };
            }
        }
        return {
            region: 'outside',
            bubble: undefined,
        };
    };

    /**
     * 자손버블좌표계에서 자식버블좌표계로 변환
     *
     * 사용처: 버블 이동, 내부의 요소를 cameraView로 변환하기 위한 사전 작업
     *
     * TODO: 최적화, useBubble에 의존하고 있음 => 의존성 제거 혹은 계산부분 분리 필요
     */
    const descendant2child = (descendant: Bubble, ancestorPath: string): Bubble | undefined => {
        const depth = getPathDifferentDepth(ancestorPath, descendant.path);
        if (depth == undefined) return undefined;
        if (depth <= 0) return undefined; // depth가 0 이하인 경우 render X
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

    /**
     * texture minification을 위한 비율 계산
     * 1보다 크면 bubble이 더 큼, 작으면 camera가 더 큼
     * alising이 필요하면 undefined 리턴?
     * renaming? : getRatioWithCameraForRendering
     */
    const getRatioWithCamera = (bubble: Bubble, cameraView: ViewCoord) => {
        const depth = getPathDifferentDepth(cameraView.path, bubble.path);
        if (depth == undefined) return undefined;
        // TODO 0 이하의 경우 고려 안함
        if (depth == 0) return 200 / cameraView.pos.width;
        if (depth == 1) return bubble.width / cameraView.pos.width;
        else if (depth > 1) {
            let path: string | undefined = bubble.path;
            let ret = bubble.width;

            let parent: Bubble | undefined;
            for (let i = 1; i < depth; i++) {
                path = getParentPath(path);
                if (path == undefined) return undefined;
                parent = findBubble(path);
                if (parent == undefined) return undefined;
                ret = (ret * parent.width) / 200;
            }
            ret = ret / cameraView.pos.width;
            return ret;
        }
    };

    const setBubbleTree = (bubbleTreeRoot: BubbleTreeNode) => {
        dispatch({ type: 'SET_BUBBLE_TREE', payload: bubbleTreeRoot });
    };

    const _addBubbleInTree = (bubble: Bubble, childrenPaths: Array<string>) => {
        dispatch({ type: 'ADD_BUBBLE_IN_TREE', payload: { bubble, childrenPaths } });
    };

    const _removeBubbleInTree = (bubble: Bubble) => {
        dispatch({ type: 'REMOVE_BUBBLE_IN_TREE', payload: { bubble } });
    };

    /**
     *
     * path 밑의 모든 bubble을 가져옴
     */
    const getDescendantBubbles = (path: string) => {
        const pathList = pathToList(path);
        let currentNode: BubbleTreeNode | undefined = state.bubbleTree;
        for (const name of pathList) {
            if (name == '') continue;
            currentNode = currentNode.children.find((node) => node.name === name);
            if (currentNode == undefined) return []; // 비정상적인 경우(해당 경로가 없음)
        }

        const findDescendants = (node: BubbleTreeNode): Array<Bubble> => {
            const childrenBubbles = node.children
                .map((child) => child.this)
                .filter((bubble): bubble is Bubble => bubble !== undefined);
            const descendants = node.children.flatMap((child) => findDescendants(child));
            return [...childrenBubbles, ...descendants];
        };
        return findDescendants(currentNode);
    };

    const getChildBubbles = (path: string): Array<Bubble> => {
        const pathList = pathToList(path);
        let currentNode: BubbleTreeNode | undefined = state.bubbleTree;
        for (const name of pathList) {
            if (name == '') continue;
            currentNode = currentNode.children.find((node) => node.name === name);
            if (currentNode == undefined) return []; // 비정상적인 경우(해당 경로가 없음)
        }
        return currentNode.children
            .map((child) => child.this)
            .filter((bubble): bubble is Bubble => bubble !== undefined);
    };

    const getBubbleInTree = (bubble: Bubble): BubbleTreeNode | undefined => {
        const pathList = pathToList(bubble.path);
        let currentNode: BubbleTreeNode | undefined = state.bubbleTree;
        for (const name of pathList) {
            if (name == '') continue;
            if (currentNode == undefined) return undefined;
            currentNode = currentNode.children.find((child) => child.name == name);
        }
        return currentNode;
    };

    const bubbles: Array<Bubble> = bubbleQuery.data ?? [];

    /**
     * TODO 버블 청크 구현 후 버블 트리로 목록 가져오기
     */
    useEffect(() => {
        if (!bubbleQuery.data) return;
        if (bubbleQuery.isPending || bubbleQuery.isLoading) return;
        bubbles.forEach((bubble) => {
            addBubble({ ...bubble }, []);
        });
        if (isReadyToShowRef.current === false) setIsReadyToShow(true);
    }, [bubbles]);

    return (
        <BubbleContext.Provider
            value={{
                setFocusBubblePath,
                getFocusBubblePath,
                clearAllBubbles,
                getBubbles,
                getDescendantBubbles,
                getChildBubbles,
                getCreatingBubble,
                addBubble,
                removeBubble,
                updateBubble,
                setCreatingBubble,
                findBubble,
                identifyTouchRegion,
                descendant2child,
                getRatioWithCamera,
                view2BubbleWithVector2D,
                view2BubbleWithRect,
                bubbleTree: state.bubbleTree,
                setBubbleTree,
                getBubbleInTree,
            }}
        >
            {children}
        </BubbleContext.Provider>
    );
};
