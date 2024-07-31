import { bubbleAPI } from '@/api/BubbleApi';
import { APIException } from '@/api/exceptions';

export const getBubbleAPI = async (workspace: string, path: string, depth: number = 1) => {
    try {
        const res = await bubbleAPI.get<Bubble, 'INAPPROPRIATE_DEPTH'>(
            `/bubble/${workspace}?path=${path}&depth=${depth.toString()}`,
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

export const deleteBubbleAPI = async (workspace: string, path: string, isCascade: boolean = true) => {
    try {
        const res = await bubbleAPI.delete<Bubble, 'INAPPROPRIATE_DEPTH'>(
            `/bubble/${workspace}?path=${path}&isCascade=${isCascade}`,
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

export const getBubbleTreeAPI = async (workspace: string, path: string = '/', depth: number = -1) => {
    try {
        const res = await bubbleAPI.get<Bubble, 'INAPPROPRIATE_DEPTH'>(
            `/bubble/tree/${workspace}?path=${path}&${depth ? 'depth=' + depth.toString() : ''}`,
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
export const createBubbleAPI = async (workspace: string, path: string) => {
    try {
        const res = await bubbleAPI.post<CreateBubbleReq, Bubble, 'NO_PARENT' | 'ALREADY_EXEIST'>(
            `/bubble/${workspace}?path=${path}`,
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
export const updateBubbleAPI = async (workspace: string, path: string) => {
    try {
        const res = await bubbleAPI.put<UpdateBubbleReq, Record<string, never>, 'NO_EXEIST_BUBBLE' | 'FAIL_EXEIT'>(
            `/bubble/${workspace}?path=${path}`,
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
