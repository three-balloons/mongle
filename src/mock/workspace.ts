export const mockedGetWorkspaces = {
    code: 'OK',
    message: '',
    data: [
        {
            name: '3학년 1학기',
            id: '42094830',
            theme: '하늘',
        },
        {
            name: '아주매우굉장히굉장히긴이름아주매우굉장히긴이름',
            id: '123567',
            theme: '노랑',
        },
        {
            name: 'test',
            id: '1235367',
            theme: '분홍',
        },
        {
            name: '하이',
            id: '1223567',
            theme: '연두',
        },
        {
            name: '테스트2',
            id: '1235667',
            theme: '분홍',
        },
        {
            name: '테스트',
            id: '1523567',
            theme: '연두',
        },

        {
            name: 'test',
            id: '1235697',
            theme: '하늘',
        },
    ],
};

export const mockedGetDeletedWorkspaces = {
    code: 'OK',
    message: '',
    data: [
        {
            name: '삭제띠',
            id: '42094830',
            theme: '하늘',
        },
    ],
};

export const mockedGetWorkspace = {
    code: 'OK',
    message: '',
    data: {
        id: '1',
        name: 'workspace1',
        theme: '하늘',
    },
};

export const mockedDeleteWorkspace = {
    code: 'OK',
    message: '',
    data: {},
};

export const mockedCreateWorkspace = {
    code: 'OK',
    message: '',
    data: {
        id: '1',
        name: 'workspace1',
        theme: '분홍',
    },
};

export const mockedUpdateWorkspace = {
    code: 'OK',
    message: '',
    data: {
        id: '1',
        name: 'workspace1',
        theme: '연두',
    },
};
