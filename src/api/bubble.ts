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
    name: string;
    top: number;
    left: number;
    height: number;
    width: number;
    visible: boolean;
    bubblized: boolean;
};
interface CreateBubbleRes extends Rect {
    path: string;
    name: string;
    curves: Array<Curve>;
    bubblized: boolean;
    visible: boolean;
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
                name: bubble.name,
                bubblized: bubble.isBubblized,
                visible: bubble.isVisible,
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

type UpdateCurveReq = {
    delete?: Array<{ id: number }>;
    update?: Array<{
        id: number;
        curve: {
            config: PenConfig;
            position: Array<{
                x: number;
                y: number;
                visible: boolean;
            }>;
        };
    }>;
    create?: Array<{
        curve: {
            config: PenConfig;
            position: Array<{
                x: number;
                y: number;
                visible: boolean;
            }>;
        };
    }>;
};

type UpdateCurveRes = {
    delete: Array<{ id: number; successYn: boolean }>;
    update: Array<{ id: number; successYn: boolean }>;
    create: Array<{ id: number; successYn: boolean }>;
};

type updateCurvePrams = {
    workspaceId: string;
    bubblePath: string;
    deletedCurves?: Array<{ id: number }>;
    updatedCurves?: Array<Curve>;
    createdCurves: Array<Curve>;
};
/**
 * 버블에 포함된 커브 수정하는 API
 * @param workspaceId workspaceId
 * @param bubblePath curve가 업데이트 될 Bubble의 path
 * @returns
 */
export const updateCurveAPI = async ({
    workspaceId,
    bubblePath,
    deletedCurves,
    updatedCurves,
    createdCurves,
}: updateCurvePrams) => {
    try {
        if (IS_MOCK) {
            const res = mockedUpdateBubble.data as UpdateCurveRes;
            return res;
        }
        const res = await bubbleAPI.put<UpdateCurveReq, UpdateCurveRes, 'NO_EXEIST_BUBBLE' | 'FAIL_EXEIT'>(
            `/bubble/${workspaceId}/curve?path=${bubblePath}`,
            {
                delete: deletedCurves ?? [],
                update:
                    updatedCurves?.map((curve) => {
                        return {
                            id: curve.id ?? 0,
                            curve: {
                                config: curve.config,
                                position: curve.position.map((point) => {
                                    return {
                                        x: point.x,
                                        y: point.y,
                                        visible: point.isVisible,
                                    };
                                }),
                            },
                        };
                    }) ?? [],
                create:
                    createdCurves?.map((curve) => {
                        return {
                            curve: {
                                config: curve.config,
                                position: curve.position.map((point) => {
                                    return {
                                        x: point.x,
                                        y: point.y,
                                        visible: point.isVisible,
                                    };
                                }),
                            },
                        };
                    }) ?? [],
            },
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
