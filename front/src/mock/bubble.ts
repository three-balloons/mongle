// data 가공 형태 논의하기
// child를 포함한 json형태? bubble list형태?

const bubble1: Bubble = {
    path: '/1',
    name: '2',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    isBubblized: false,
    isVisible: true,
    curves: [],
};

const bubble2: Bubble = {
    path: '/1/2',
    name: '2',
    top: -50,
    left: -50,
    width: 50,
    height: 50,
    isBubblized: false,
    isVisible: true,
    curves: [],
};

const bubble3: Bubble = {
    path: '/1/3',
    name: '2',
    top: 50,
    left: 50,
    width: 10,
    height: 10,
    isBubblized: false,
    isVisible: true,
    curves: [],
};

const bubble4: Bubble = {
    path: '/1/2/4',
    name: '2',
    top: 50,
    left: 50,
    width: 50,
    height: 50,
    isBubblized: false,
    isVisible: true,
    curves: [],
};

const bubble5: Bubble = {
    path: '/1/2/4/5',
    name: '2',
    top: -50,
    left: -50,
    width: 100,
    height: 100,
    isBubblized: false,
    isVisible: true,
    curves: [],
};

export const mockedBubbles: Array<Bubble> = [bubble1, bubble2, bubble3, bubble4, bubble5];
