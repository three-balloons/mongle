import { bubble2globalWithRect, global2bubbleWithRect } from '@/util/coordSys/conversion';
import { getParentPath, pathToList } from '@/util/path/path';

type BubbleState = {
    bubbleTree: BubbleTreeNode;
};

// 추가
// getBubble
type BubbleAction =
    | { type: 'GET_BUBBLE_TREE' }
    | { type: 'SET_BUBBLE_TREE'; payload: { bubbleTreeNode: BubbleTreeNode } }
    | { type: 'ADD_BUBBLE_IN_TREE'; payload: { bubble: Bubble; childrenPaths: Array<string> } }
    | { type: 'REMOVE_BUBBLE_IN_TREE'; payload: { bubble: Bubble } };

export const bubbleTreeReducer = (state: BubbleState, action: BubbleAction): BubbleState => {
    switch (action.type) {
        case 'GET_BUBBLE_TREE':
            return state;
        case 'SET_BUBBLE_TREE':
            return { ...state, bubbleTree: action.payload.bubbleTreeNode };
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
                            child.this.path =
                                parentPath === '/' ? parentPath + child.name : parentPath + '/' + child.name;
                        }
                    });
                    prevNode.children = [
                        ...prevNode.children.filter((child) => child != currentNode),
                        ...currentNode.children,
                    ];
                    const updateDescendantPath = (node: BubbleTreeNode) => {
                        const path = node.this?.path ?? '';
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
