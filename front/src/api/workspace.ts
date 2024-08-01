import { bubbleAPI } from '@/api/api';
import { APIException } from '@/api/exceptions';

type GetWorkspaceRes = Workspace;
export const getWorkspaceAPI = async (workspaceId: string) => {
    try {
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
export const createBubbleAPI = async () => {
    try {
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
