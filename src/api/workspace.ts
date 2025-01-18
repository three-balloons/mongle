import { mongleApi } from '@/api/mongleApi';
import { APIException } from '@/api/exceptions';
import {
    mockedGetWorkspaces,
    mockedGetWorkspace,
    mockedUpdateWorkspace,
    mockedDeleteWorkspace,
    mockedCreateWorkspace,
    mockedGetDeletedWorkspaces,
} from '@/mock/workspace';
const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

type WorkspaceRes = {
    update_date: string;
    delete_date: string;
} & Workspace;
type GetWorkspaceRes = WorkspaceRes;
type WorkspacePrams = {
    workspaceId: string;
};
export const getWorkspaceAPI = async ({ workspaceId }: WorkspacePrams) => {
    try {
        if (IS_MOCK) {
            const res = mockedGetWorkspace.data as GetWorkspaceRes;
            return res;
        }
        const res = await mongleApi.get<GetWorkspaceRes, 'NOT_EXIST'>(`/workspace/${workspaceId}`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'NOT_EXIST') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type GetAllWorkspaceRes = Array<WorkspaceRes>;
export const getAllWorkspaceAPI = async () => {
    try {
        if (IS_MOCK) {
            const res = mockedGetWorkspaces.data as GetAllWorkspaceRes;
            return res;
        }
        const res = await mongleApi.get<GetAllWorkspaceRes, 'NOT_EXIST'>(`/workspace`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            // TODO remove this error code
            if (error.code === 'NOT_EXIST') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type UpdateWorkspacePrams = {
    workspaceId: string;
    name: string;
    theme: string;
};
type UpdateWorkspaceReq = {
    name: string;
    theme: string;
};
type UpdateWorkspaceRes = WorkspaceRes;
export const updateWorkspaceAPI = async ({ workspaceId, name, theme }: UpdateWorkspacePrams) => {
    try {
        if (IS_MOCK) {
            const res = mockedUpdateWorkspace.data as UpdateWorkspaceRes;
            return res;
        }
        const res = await mongleApi.put<UpdateWorkspaceReq, UpdateWorkspaceRes, 'ALREADY_EXIST'>(
            `/workspace/${workspaceId}`,
            {
                name: name,
                theme: theme,
            },
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'ALREADY_EXIST') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type DeleteWorkspaceRes = WorkspaceRes;
type DeleteBubblePrams = {
    workspaceId: string;
};
export const deleteWorkspaceAPI = async ({ workspaceId }: DeleteBubblePrams) => {
    try {
        if (IS_MOCK) {
            const res = mockedDeleteWorkspace.data as DeleteWorkspaceRes;
            return res;
        }
        const res = await mongleApi.delete<DeleteWorkspaceRes, 'NOT_EXIST'>(`/workspace/${workspaceId}`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'NOT_EXIST') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type CreateWorkspaceReq = {
    name: string;
    theme: string;
};
type CreateWorkspaceRes = WorkspaceRes;
export const createWorkspaceAPI = async ({ name, theme }: CreateWorkspaceReq) => {
    try {
        if (IS_MOCK) {
            const res = mockedCreateWorkspace.data as CreateWorkspaceRes;
            return res;
        }
        const res = await mongleApi.post<CreateWorkspaceReq, CreateWorkspaceRes, 'ALREADY_EXIST'>(`/workspace`, {
            name: name,
            theme: theme,
        });
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'ALREADY_EXEIST') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type GetDeletedWorkspaceRes = Array<WorkspaceRes>;
export const getDeletedWorkspaceAPI = async () => {
    try {
        if (IS_MOCK) {
            const res = mockedGetDeletedWorkspaces.data as GetDeletedWorkspaceRes;
            return res;
        }
        const res = await mongleApi.get<GetDeletedWorkspaceRes, 'NOT_EXIST'>(`/workspace/deleted`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            // TODO remove this error code
            if (error.code === 'NOT_EXIST') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};
