export const mockedGetBubble = [
    {
        path: '/몽글',
        name: '몽글',
        top: -100,
        left: -100,
        width: 200,
        height: 200,
        isVisible: true,
        isBubblized: false,
        curves: [
            {
                position: [
                    { x: 10, y: 10, isVisible: true },
                    { x: 50, y: 50, isVisible: true },
                ],
                id: 1,
                config: {
                    color: '#000000',
                    thickness: 5,
                },
            },
        ],
        pictures: [
            {
                id: 'eb9d9vd9d-3b7d-4bad-3bdd-2b0d7d3dcb6d',
                left: 10,
                top: 20,
                width: 30,
                height: 50,
                fid: '25s3g92-232dvcd-343434dfs',
                path: '/몽글',
                isFlippedX: true,
                isFlippedY: false,
                angle: 0,
            },
        ],
    },
    {
        path: '/몽글/이름',
        name: '이름',
        top: -50,
        left: -50,
        width: 50,
        height: 50,
        isVisible: true,
        isBubblized: false,
        curves: [
            {
                position: [
                    { x: 10, y: 10, isVisible: true },
                    { x: 50, y: 50, isVisible: true },
                ],
                id: 2,
                config: {
                    color: 'red',
                    thickness: 5,
                },
            },
        ],
        pictures: [],
    },
];

export const mockedDeleteBubble = {};

export const mockedCreateBubble = {
    path: '/운영체제',
    name: '운영체제',
    top: -50,
    left: -30,
    width: 100,
    height: 100,
    isVisible: true,
    isBubblized: true,
    curves: [],
    pictures: [],
};

export const mockedUpdateBubble = {
    delete: [
        {
            id: 1,
            successYn: true,
        },
        {
            id: 3,
            successYn: true,
        },
    ],
    update: [
        {
            id: 2,
            successYn: true,
        },
    ],
    create: [
        // 반드시 request 순서대로 줄 것!!!
        {
            id: 12,
            successYn: true,
        },
    ],
};
