// 버블 찾는 함수 추후 검색 기능 구현시 구현
// 일단 리니어 서치

import { bubbles } from '@/mock/bubble';

// path: path + bubble name
export const findBubble = (path: string): Bubble | undefined => {
    if (path == '/') return undefined;
    return bubbles.find((bubble) => bubble.path == path);
};

export const findParentBubble = (bubble: Bubble): Bubble | undefined => {
    return bubble.parent;
};
