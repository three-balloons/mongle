// TODO: penConfig 추가할 것
interface Curve {
    position: Curve2D;
    path: string;
    config: PenConfig;
    isVisible: boolean;
    id: string | undefined;
}

interface Bubble extends Rect {
    path: string;
    name: string;
    curves: Array<Curve>;
    isBubblized: boolean;
    isVisible: boolean;
}

type BubbleTreeNode = {
    name: string;
    children: Array<BubbleTreeNode>;
    parent: BubbleTreeNode | undefined;
    this: Bubble | undefined;
};

interface Workspace {
    id: string;
    name: string;
    theme: Theme;
}
