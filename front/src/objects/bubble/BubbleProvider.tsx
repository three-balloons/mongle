import { bubble2globalWithRect, bubble2Vector2D, global2bubbleWithRect } from '@/util/coordSys/conversion';
import { getParentPath, getPathDifferentDepth, pathToList } from '@/util/path/path';
import { createContext, useRef, useReducer } from 'react';

export type BubbleContextProps = {
    /* 버블 */
    getCreatingBubble: () => Rect;
    updateCreatingBubble: (rect: Rect) => void;
    clearAllBubbles: () => void;
    getBubbles: () => Array<Bubble>;
    addBubble: (bubble: Bubble, childrenPaths: Array<string>) => void;
    removeBubble: (bubble: Bubble) => void;
    findBubble: (path: string) => Bubble | undefined;

    /* 좌표 변환 */
    descendant2child: (descendant: Bubble, ancestorPath: string) => Bubble | undefined;
    getRatioWithCamera: (bubble: Bubble, cameraView: ViewCoord) => number | undefined;
    view2BubbleWithVector2D: (pos: Vector2D, cameraView: ViewCoord, bubblePath: string) => Vector2D;

    /* 버블 트리 */
    bubbleTree: BubbleTreeNode;
    setBubbleTree: (bubbleTreeRoot: BubbleTreeNode) => void;
    getBubbleInTree: (bubble: Bubble) => BubbleTreeNode | undefined;
    getDescendantBubbles: (path: string) => Array<Bubble>;
    getChildBubbles: (path: string) => Array<Bubble>;
};

export const BubbleContext = createContext<BubbleContextProps | undefined>(undefined);

type BubbleState = {
    bubbleTree: BubbleTreeNode;
};
export type BubbleAction =
    | { type: 'GET_BUBBLE_TREE' }
    | { type: 'SET_BUBBLE_TREE'; payload: BubbleTreeNode }
    | { type: 'ADD_BUBBLE_IN_TREE'; payload: { bubble: Bubble; childrenPaths: Array<string> } }
    | { type: 'REMOVE_BUBBLE_IN_TREE'; payload: { bubble: Bubble } };

const bubbleTreeReducer = (state: BubbleState, action: BubbleAction): BubbleState => {
    switch (action.type) {
        case 'GET_BUBBLE_TREE':
            return state;
        case 'SET_BUBBLE_TREE':
            return { ...state, bubbleTree: action.payload };
        case 'ADD_BUBBLE_IN_TREE': {
            const addBubbleInTree = (bubbleTreeRoot: BubbleTreeNode, bubble: Bubble, childrenPaths: Array<string>) => {
                const pathList = pathToList(bubble.path);
                let currentNode: BubbleTreeNode | undefined = bubbleTreeRoot;
                let prevNode: BubbleTreeNode | undefined;
                for (const name of pathList) {
                    if (name == '') continue;
                    if (currentNode == undefined) return bubbleTreeRoot; // 비정상적인 경우(해당 경로가 없음)
                    prevNode = currentNode;
                    currentNode = currentNode.children.find((node) => node.name === name);
                }
                if (currentNode === undefined) {
                    const newNode: BubbleTreeNode = {
                        name: pathList[pathList.length - 1],
                        children: [],
                        this: bubble,
                        parent: prevNode,
                    };
                    if (prevNode?.children) {
                        newNode.this = bubble;
                        newNode.children = prevNode.children.filter((child) => {
                            const parentPath = getParentPath(bubble.path);
                            const path = parentPath === '/' ? '/' + child.name : parentPath + '/' + child.name;
                            return childrenPaths.find((childPath) => childPath == path);
                        });
                        prevNode.children = prevNode.children.filter((child) => {
                            const parentPath = getParentPath(bubble.path);
                            const path = parentPath === '/' ? '/' + child.name : parentPath + '/' + child.name;
                            const isNewNodeChild = childrenPaths.find((childPath) => childPath == path);
                            if (isNewNodeChild && child.this) {
                                const parentBubble = prevNode.this;
                                const pos = global2bubbleWithRect(
                                    bubble2globalWithRect(child.this as Rect, parentBubble),
                                    bubble2globalWithRect(newNode.this as Rect, parentBubble),
                                );
                                // refernce 유지
                                child.this.top = pos.top;
                                child.this.left = pos.left;
                                child.this.height = pos.height;
                                child.this.width = pos.width;
                            }
                            return !isNewNodeChild;
                        });
                        prevNode.children.push(newNode);
                        // 하위의 path 업데이트
                        const updateDescendantPath = (node: BubbleTreeNode) => {
                            if (!node.this) return;
                            const path = node.this.path;
                            for (const child of node.children) {
                                if (child.this) {
                                    child.this.path = path + '/' + child.this.name;
                                    updateDescendantPath(child);
                                }
                            }
                        };
                        updateDescendantPath(newNode);
                    }
                }
                return bubbleTreeRoot;
            };
            return {
                ...state,
                bubbleTree: addBubbleInTree(state.bubbleTree, action.payload.bubble, action.payload.childrenPaths),
            };
        }
        case 'REMOVE_BUBBLE_IN_TREE': {
            const removeBubbleInTree = (bubbleTreeRoot: BubbleTreeNode, bubble: Bubble) => {
                const pathList = pathToList(bubble.path);
                let currentNode: BubbleTreeNode | undefined = bubbleTreeRoot;
                let prevNode: BubbleTreeNode | undefined;
                for (const name of pathList) {
                    if (name == '') continue;
                    if (currentNode == undefined) return bubbleTreeRoot; // 비정상적인 경우(해당 경로가 없음)
                    prevNode = currentNode;
                    currentNode = currentNode.children.find((node) => node.name === name);
                }
                if (prevNode && currentNode) {
                    const parentPath = prevNode.this?.path ?? '/';
                    currentNode.children.forEach((child) => {
                        const pos = global2bubbleWithRect(
                            bubble2globalWithRect(child.this as Rect, currentNode.this),
                            prevNode.this,
                        );
                        if (child.this) {
                            child.this.top = pos.top;
                            child.this.left = pos.left;
                            child.this.height = pos.height;
                            child.this.width = pos.width;
                            child.this.path = parentPath + '/' + child.name;
                        }
                    });
                    prevNode.children = [
                        ...prevNode.children.filter((child) => child != currentNode),
                        ...currentNode.children,
                    ];
                    const updateDescendantPath = (node: BubbleTreeNode) => {
                        if (!node.this) return;
                        const path = node.this.path;
                        for (const child of node.children) {
                            if (child.this) {
                                child.this.path = path + '/' + child.this.name;
                                updateDescendantPath(child);
                            }
                        }
                    };
                    updateDescendantPath(prevNode);
                }
                return bubbleTreeRoot;
            };
            return {
                ...state,
                bubbleTree: removeBubbleInTree(state.bubbleTree, action.payload.bubble),
            };
        }
        default:
            return state;
    }
};

type BubbleProviderProps = {
    children: React.ReactNode;
    workspaceName?: string;
};
export const BubbleProvider: React.FC<BubbleProviderProps> = ({ children, workspaceName = '제목없음' }) => {
    const bubblesRef = useRef<Array<Bubble>>([]);
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

    const addBubble = (bubble: Bubble, childrenPaths: Array<string>) => {
        bubblesRef.current = [...bubblesRef.current, bubble];
        _addBubbleInTree(bubble, childrenPaths);
    };

    // children 정보 필요 없음
    const removeBubble = (bubbleToRemove: Bubble) => {
        bubblesRef.current = [...bubblesRef.current.filter((bubble) => bubble !== bubbleToRemove)];
        _removeBubbleInTree(bubbleToRemove);
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
            ret = bubble2Vector2D(ret, bubbleView);
        }
        return ret;
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

    return (
        <BubbleContext.Provider
            value={{
                clearAllBubbles,
                getBubbles,
                getDescendantBubbles,
                getChildBubbles,
                getCreatingBubble,
                addBubble,
                removeBubble,
                updateCreatingBubble,
                findBubble,
                descendant2child,
                getRatioWithCamera,
                view2BubbleWithVector2D,
                bubbleTree: state.bubbleTree,
                setBubbleTree,
                getBubbleInTree,
            }}
        >
            {children}
        </BubbleContext.Provider>
    );
};
