// data 가공 형태 논의하기
// child를 포함한 json형태? bubble list형태?

export const mockedGetBubble = {
    code: 'OK',
    message: '',
    data: {
        path: '/ws1/A',
        name: 'A',
        top: 150,
        left: 250,
        width: 60,
        height: 60,
        isVisible: true,
        isBubblized: false,
        curves: [],
        children: [
            {
                path: '/ws1/A/B',
                name: 'B',
                top: 200,
                left: 300,
                width: 70,
                height: 70,
                isVisible: true,
                isBubblized: false,
                curves: [
                    {
                        position: [
                            {
                                x: 90,
                                y: 100,
                                isVisible: true,
                            },
                            {
                                x: 110,
                                y: 120,
                                isVisible: true,
                            },
                        ],
                        path: '/ws1/A/B',
                        config: {
                            color: '#CCCCCC',
                            thickness: 3,
                        },
                        id: '1',
                        isVisible: true,
                    },
                ],
                children: [
                    {
                        path: '/ws1/A/B/C',
                        name: 'C',
                        top: 250,
                        left: 350,
                        width: 80,
                        height: 80,
                        isVisible: true,
                        isBubblized: false,
                        curves: [],
                        children: [
                            {
                                path: '/ws1/A/B/C/D',
                                name: 'D',
                                top: 300,
                                left: 400,
                                width: 90,
                                height: 90,
                                isVisible: true,
                                isBubblized: false,
                                curves: [],
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
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
        isVisible: true,
        isBubblized: true,
        curves: [],
    },
};

export const mockedUpdateBubble = {
    code: 'OK',
    message: '',
    data: {
        delete: [
            {
                id: '1',
                successYn: true,
            },
            {
                id: '3',
                successYn: true,
            },
        ],
        update: [
            {
                id: '2',
                successYn: true,
            },
        ],
        create: [
            // 반드시 request 순서대로 줄 것!!!
            {
                id: '12',
                successYn: true,
            },
        ],
    },
};
