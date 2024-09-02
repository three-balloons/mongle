import { bubbleAPI } from '@/api/api';
import { APIException } from '@/api/exceptions';
import {
    mockedGetWorkspaces,
    mockedGetWorkspace,
    mockedUpdateWorkspace,
    mockedDeleteWorkspace,
    mockedCreateWorkspace,
} from '@/mock/workspace';
const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

type GetWorkspaceRes = Workspace;
export const getWorkspaceAPI = async (workspaceId: string) => {
    try {
        if (IS_MOCK) {
            const res = mockedGetWorkspace.data as GetWorkspaceRes;
            return res;
        }
        const res = await bubbleAPI.get<GetWorkspaceRes, 'NOT_EXIST'>(`/workspace/${workspaceId}`);
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

type GetAllWorkspaceRes = Array<Workspace>;
export const getAllWorkspaceAPI = async () => {
    try {
        if (IS_MOCK) {
            const res = mockedGetWorkspaces.data as GetAllWorkspaceRes;
            return res;
        }
        const res = await bubbleAPI.get<GetAllWorkspaceRes, 'NOT_EXIST'>(`/workspace`);
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

type UpdateWorkspaceReq = Workspace;
type UpdateWorkspaceRes = Workspace;
export const updateWorkspaceAPI = async (workspaceId: string) => {
    try {
        if (IS_MOCK) {
            const res = mockedUpdateWorkspace.data as UpdateWorkspaceRes;
            return res;
        }
        const res = await bubbleAPI.put<UpdateWorkspaceReq, UpdateWorkspaceRes, 'ALREADY_EXIST'>(
            `/workspace/${workspaceId}`,
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

type DeleteWorkspaceRes = Workspace;
export const deleteBubbleAPI = async (workspaceId: string) => {
    try {
        if (IS_MOCK) {
            const res = mockedDeleteWorkspace.data as DeleteWorkspaceRes;
            return res;
        }
        const res = await bubbleAPI.delete<DeleteWorkspaceRes, 'NOT_EXIST'>(`/bubble/${workspaceId}`);
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
    theme: Theme;
};
type CreateWorkspaceRes = Workspace;
export const createWorkspaceAPI = async () => {
    try {
        if (IS_MOCK) {
            const res = mockedCreateWorkspace.data as CreateWorkspaceRes;
            return res;
        }
        const res = await bubbleAPI.post<CreateWorkspaceReq, CreateWorkspaceRes, 'ALREADY_EXIST'>(`/workspace`);
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
