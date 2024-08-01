import { bubbleAPI } from '@/api/api';
import { APIException } from '@/api/exceptions';

type GetBubbleRes = Bubble;
export const getBubbleAPI = async (workspaceId: string, path: string, depth: number = 1) => {
    try {
        const res = await bubbleAPI.get<GetBubbleRes, 'INAPPROPRIATE_DEPTH'>(
            `/bubble/${workspaceId}?path=${path}&depth=${depth.toString()}`,
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'INAPPROPRIATE_DEPTH') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type DeleteBubbleRes = Bubble;
export const deleteBubbleAPI = async (workspaceId: string, path: string, isCascade: boolean = true) => {
    try {
        const res = await bubbleAPI.delete<DeleteBubbleRes, 'INAPPROPRIATE_DEPTH'>(
            `/bubble/${workspaceId}?path=${path}&isCascade=${isCascade}`,
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'INAPPROPRIATE_DEPTH') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type GetBubbleTreeRes = Bubble;
export const getBubbleTreeAPI = async (workspaceId: string, path: string = '/', depth: number = -1) => {
    try {
        const res = await bubbleAPI.get<GetBubbleTreeRes, 'INAPPROPRIATE_DEPTH'>(
            `/bubble/tree/${workspaceId}?path=${path}&${depth ? 'depth=' + depth.toString() : ''}`,
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'INAPPROPRIATE_DEPTH') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type CreateBubbleReq = {
    top: number;
    left: number;
    height: number;
    width: number;
};
type CreateBubbleRes = Bubble;
export const createBubbleAPI = async (workspaceId: string, path: string) => {
    try {
        const res = await bubbleAPI.post<CreateBubbleReq, CreateBubbleRes, 'NO_PARENT' | 'ALREADY_EXEIST'>(
            `/bubble/${workspaceId}?path=${path}`,
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'NO_PARENT' || error.code === 'ALREADY_EXEIST') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type UpdateBubbleReq = {
    delete: Array<{ id: number }>;
    update: Array<{
        id: number;
        curve: Curve;
    }>;
    create: Array<{ curve: Curve }>;
};
type UpdateBubbleRes = Record<string, never>;
export const updateBubbleAPI = async (workspaceId: string, path: string) => {
    try {
        const res = await bubbleAPI.put<UpdateBubbleReq, UpdateBubbleRes, 'NO_EXEIST_BUBBLE' | 'FAIL_EXEIT'>(
            `/bubble/${workspaceId}?path=${path}`,
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'NO_EXEIST_BUBBLE' || error.code === 'FAIL_EXEIT') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};
