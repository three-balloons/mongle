/**
 * 비즈니스 로직에서 필요한 객체 타입
 */

// TODO: penConfig 추가할 것
interface Curve {
    position: Curve2D;
    config: PenConfig;
    id: number;
}

interface Bubble extends Rect {
    path: string;
    name: string;
    curves: Array<Curve>;
    isBubblized: boolean;
    isVisible: boolean;
    nameSizeInCanvas: number; // 캔버스에서 나타나는 이름의 크기, 프론트에서만 사용
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
