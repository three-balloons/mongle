// data 가공 형태 논의하기
// child를 포함한 json형태? bubble list형태?

const bubble1: Bubble = {
    path: '/1',
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    curves: [
        {
            position: [
                { x: 10, y: 10 },
                { x: 50, y: 50 },
            ],
            path: '/1',
            config: {
                color: 'red',
                thickness: 5,
                alpha: 1,
            },
        },
    ],
    parent: undefined,
    children: [],
};

const bubble2: Bubble = {
    path: '/1/2',
    top: -50,
    left: -50,
    width: 50,
    height: 50,
    curves: [
        {
            position: [
                { x: 10, y: 10 },
                { x: 50, y: 50 },
            ],
            path: '/1/2',
            config: {
                color: 'red',
                thickness: 5,
                alpha: 1,
            },
        },
    ],
    parent: bubble1,
    children: [],
};

const bubble3: Bubble = {
    path: '/1/3',
    top: 50,
    left: 50,
    width: 10,
    height: 10,
    curves: [],
    children: [],
    parent: bubble1,
};

const bubble4: Bubble = {
    path: '/1/2/4',
    top: 50,
    left: 50,
    width: 50,
    height: 50,
    curves: [],
    children: [],
    parent: bubble2,
};

const bubble5: Bubble = {
    path: '/1/2/4/5',
    top: -50,
    left: -50,
    width: 100,
    height: 100,
    curves: [],
    children: [],
    parent: bubble4,
};

bubble1.children = [bubble2, bubble3];
bubble2.children = [bubble4];
bubble4.children = [bubble5];
export const bubbles: Array<Bubble> = [bubble1, bubble2, bubble3, bubble4, bubble5];
