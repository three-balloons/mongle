import {
    CreateWorkspaceRes,
    GetAllWorkspaceRes,
    GetDeletedWorkspaceRes,
    GetWorkspaceRes,
    UpdateWorkspaceRes,
} from '@/api/workspaces/type';

export const mockedGetWorkspaces: GetAllWorkspaceRes = [
    {
        name: '몽글이의 노트',
        id: '42094830',
        theme: '하늘',
        createdAt: '2024-12-31',
        updatedAt: '2025-01-31',
    },
    {
        name: 'TO DO',
        id: '123567',
        theme: '연두',
        createdAt: '2024-12-31',
        updatedAt: '2025-01-31',
    },
    {
        name: '수학 공부',
        id: '1235367',
        theme: '하늘',
        createdAt: '2024-12-31',
        updatedAt: '2025-01-31',
    },
];

export const mockedGetDeletedWorkspaces: GetDeletedWorkspaceRes = [
    {
        name: '삭제띠',
        id: '42094830',
        theme: '하늘',
        createdAt: '2024-12-31',
        updatedAt: '2025-01-31',
        deletedAt: '2025-01-31',
    },
];

export const mockedGetWorkspace: GetWorkspaceRes = {
    id: '1',
    name: '몽글이의 노트',
    theme: '하늘',
    createdAt: '2024-12-31',
    updatedAt: '2025-01-31',
};

export const mockedDeleteWorkspace = {};

export const mockedCreateWorkspace: CreateWorkspaceRes = {
    id: '1',
    name: 'workspace1',
    theme: '분홍',
    createdAt: '2024-12-31',
    updatedAt: '2025-01-31',
};

export const mockedUpdateWorkspace: UpdateWorkspaceRes = {
    id: '1',
    name: 'workspace1',
    theme: '연두',
    createdAt: '2024-12-31',
    updatedAt: '2025-01-31',
};
