// 버블 찾는 함수 추후 검색 기능 구현시 구현
// 일단 리니어 서치
// path: path + bubble name
export const findBubble = (path: string): Bubble | undefined => {
    if (path == '/') return undefined;
    return {
        path: '/',
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        children: [],
        curves: [],
    };
};
