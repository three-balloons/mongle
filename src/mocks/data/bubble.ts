import { CreateBubbleRes, GetAllBubbleRes, GetBubbleRes, UpdateBubbleRes } from '@/api/bubbles/type';

export const mockedGetAllBubbles: GetAllBubbleRes = [
    {
        path: '/몽글',
        id: 234,
        name: '몽글',
        top: -100,
        left: -100,
        width: 200,
        height: 200,
        shapes: [
            {
                type: 'curve',
                position: '09BB0109C00107C70100DA01F9E701F9EB01',
                id: 1,
                config: {
                    color: '#004A99',
                    thickness: 5,
                },
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
        id: 2,
        shapes: [
            {
                type: 'curve',
                position: '09BB0109C00107C70100DA01F9E701F9EB01',
                id: 2,
                config: {
                    color: 'red',
                    thickness: 5,
                },
            },
        ],
    },
];
export const mockedGetBubbles: GetBubbleRes = [
    {
        path: '/몽글',
        id: 234,
        name: '몽글',
        top: -100,
        left: -100,
        width: 200,
        height: 200,
        shapes: [
            {
                type: 'curve',
                position: '09BB0109C00107C70100DA01F9E701F9EB01',
                id: 1,
                config: {
                    color: '#004A99',
                    thickness: 5,
                },
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
        id: 2,
        shapes: [
            {
                type: 'curve',
                position: '09BB0109C00107C70100DA01F9E701F9EB01',
                id: 2,
                config: {
                    color: 'red',
                    thickness: 5,
                },
            },
        ],
    },
];

export const mockedDeleteBubble = {};

export const mockedUpdateBubble: UpdateBubbleRes = {
    id: 34,
    path: '/update',
    name: 'updee',
    top: -10,
    left: -10,
    width: 10,
    height: 10,
    shapes: [],
};
export const mockedCreateBubble: CreateBubbleRes = {
    id: 234,
    path: '/운영체제',
    name: '운영체제',
    top: -50,
    left: -30,
    width: 100,
    height: 100,
    shapes: [],
};
