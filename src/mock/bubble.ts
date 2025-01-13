import { OFF_SCREEN_HEIGHT, OFF_SCREEN_WIDTH } from '@/util/constant';

const offCanvas = new OffscreenCanvas(OFF_SCREEN_WIDTH, OFF_SCREEN_HEIGHT);
const imgElem = new Image();
imgElem.src = 'https://studiomeal.com/wp-content/themes/studiomeal/images/dot/sunface.png';
imgElem.addEventListener(
    'load',
    () => {
        // off-screen 캔버스에 이미지를 그려둔다
        const offContext = offCanvas.getContext('2d');
        offContext?.drawImage(imgElem, 0, 0, OFF_SCREEN_WIDTH, OFF_SCREEN_HEIGHT);
    },
    { once: true },
);

export const mockedGetBubble = {
    code: 'OK',
    message: '',
    data: [
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
                    top: -50,
                    left: -50,
                    width: 50,
                    height: 50,
                    offScreen: offCanvas,
                    image: imgElem,
                    isFlippedX: false,
                    isFlippedy: false,
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
