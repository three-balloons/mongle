import { bubbleAPI } from '@/api/api';
import { APIException } from '@/api/exceptions';
import { mockedCreateBubble, mockedGetBubble, mockedDeleteBubble, mockedUpdateBubble } from '@/mock/bubble';
import { mockedBubbleTree } from '@/mock/tree';
const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

type GetBubbleRes = Array<Bubble>;

export const getBubbleAPI = async (workspaceId: string, path: string, depth: number = 1) => {
    try {
        if (IS_MOCK) {
            const res = mockedGetBubble.data as GetBubbleRes;
            return res;
        }
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
        if (IS_MOCK) {
            const res = mockedDeleteBubble.data as DeleteBubbleRes;
            return res;
        }
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

type BubbleTreeNode = {
    name: string;
    children: Array<BubbleTreeNode>;
};
type GetBubbleTreeRes = {
    paths: Array<{
        name: string;
        children: Array<BubbleTreeNode>;
    }>;
};
export const getBubbleTreeAPI = async (workspaceId: string, path: string = '/', depth: number = -1) => {
    try {
        if (IS_MOCK) {
            const res = mockedBubbleTree.data as GetBubbleTreeRes;
            return res;
        }
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
    isBubblized: boolean;
    isVisible: boolean;
};
interface CreateBubbleRes extends Rect {
    path: string;
    name: string;
    curves: Array<Curve>;
    isBubblized: boolean;
    isVisible: boolean;
}

export const createBubbleAPI = async (workspaceId: string, bubble: Bubble) => {
    try {
        if (IS_MOCK) {
            const res = mockedCreateBubble.data as CreateBubbleRes;
            return res;
        }
        const res = await bubbleAPI.post<CreateBubbleReq, CreateBubbleRes, 'NO_PARENT' | 'ALREADY_EXEIST'>(
            `/bubble/${workspaceId}?path=${bubble.path}`,
            {
                top: bubble.top,
                left: bubble.left,
                height: bubble.height,
                width: bubble.width,
                isBubblized: bubble.isBubblized,
                isVisible: bubble.isVisible,
            },
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

type UpdateBubbleRes = {
    delete: Array<{ id: string; successYn: boolean }>;
    update: Array<{ id: string; successYn: boolean }>;
    create: Array<{ id: string; successYn: boolean }>;
};
export const updateBubbleAPI = async (workspaceId: string, path: string) => {
    try {
        if (IS_MOCK) {
            const res = mockedUpdateBubble.data as UpdateBubbleRes;
            return res;
        }
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
