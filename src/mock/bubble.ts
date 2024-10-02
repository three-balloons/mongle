// data 가공 형태 논의하기
// child를 포함한 json형태? bubble list형태?

export const mockedGetBubble = {
    code: 'OK',
    message: '',
    data: [
        {
            path: '/운영체제',
            name: '운영체제',
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
        },
        {
            path: '/운영체제/세마포어',
            name: '세마포어',
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
        },
    ],
};

export const mockedDeleteBubble = {
    code: 'OK',
    message: '',
    data: {},
};

export const mockedCreateBubble = {
    code: 'OK',
    message: '',
    data: {
        path: '/운영체제',
        name: '운영체제',
        top: -50,
        left: -30,
        width: 100,
        height: 100,
        visible: true,
        bubblized: true,
        curves: [],
    },
};

export const mockedUpdateBubble = {
    code: 'OK',
    message: '',
    data: {
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
    },
};
