export const mockedGetWorkspaces = {
    code: 'OK',
    message: '',
    data: [
        {
            name: '몽글이의 노트',
            id: '42094830',
            theme: '하늘',
        },
        {
            name: 'TO DO',
            id: '123567',
            theme: '노랑',
        },
        {
            name: '수학 공부',
            id: '1235367',
            theme: '분홍',
        },
        // {
        //     name: '하이',
        //     id: '1223567',
        //     theme: '연두',
        // },
        // {
        //     name: '테스트2',
        //     id: '1235667',
        //     theme: '분홍',
        // },
        // {
        //     name: '테스트',
        //     id: '1523567',
        //     theme: '연두',
        // },

        // {
        //     name: 'test',
        //     id: '1235697',
        //     theme: '하늘',
        // },
    ],
};

export const mockedGetDeletedWorkspaces = [
    {
        name: '삭제띠',
        id: '42094830',
        theme: '하늘',
    },
];

export const mockedGetWorkspace = {
    id: '1',
    name: '몽글이의 노트',
    theme: '하늘',
};

export const mockedDeleteWorkspace = {};

export const mockedCreateWorkspace = {
    id: '1',
    name: 'workspace1',
    theme: '분홍',
};

export const mockedUpdateWorkspace = {
    id: '1',
    name: 'workspace1',
    theme: '연두',
};
