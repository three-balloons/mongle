import { mongleApi } from '@/api/mongleApi';
import { APIException } from '@/api/exceptions';
import { mockedCreateBubble, mockedGetBubble, mockedDeleteBubble, mockedUpdateBubble } from '@/mock/bubble';
import { GetPictureRes } from '@/api/picture';
import { pictureMapper } from '@/api/mapper/picture.mapper';
const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

type GetBubbleRes = {
    top: number;
    left: number;
    width: number;
    height: number;
    path: string;
    name: string;
    curves: Array<Curve>;
    pictures?: Array<GetPictureRes>;
    isBubblized: boolean;
    isVisible: boolean;
}[];

export const getBubblesAPI = async (workspaceId: string, path: string, depth: number = -1): Promise<Array<Bubble>> => {
    try {
        if (IS_MOCK) {
            const res = mockedGetBubble.data as GetBubbleRes;
            return res.map((bubble) => {
                return {
                    ...bubble,
                    pictures: [...(bubble.pictures?.map((picture) => pictureMapper(picture)) ?? [])],
                    nameSizeInCanvas: 30,
                };
            });
        }
        const res = await mongleApi.get<GetBubbleRes, 'INAPPROPRIATE_DEPTH'>(
            `/bubble/${workspaceId}?path=${path}&depth=${depth.toString()}`,
        );
        return res.map((bubble) => {
            return {
                ...bubble,
                pictures: [...(bubble.pictures?.map((picture) => pictureMapper(picture)) ?? [])],
                nameSizeInCanvas: 30,
            };
        });
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
interface DeleteBubblePrams {
    workspaceId: string;
    path: string;
    isCascade?: boolean;
}
export const deleteBubbleAPI = async ({ workspaceId, path, isCascade = true }: DeleteBubblePrams) => {
    try {
        if (IS_MOCK) {
            const res = mockedDeleteBubble.data as DeleteBubbleRes;
            return res;
        }
        const res = await mongleApi.delete<DeleteBubbleRes, 'INAPPROPRIATE_DEPTH'>(
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

// type BubbleTreeNode = {
//     name: string;
//     children: Array<BubbleTreeNode>;
// };
// type GetBubbleTreeRes = {
//     paths: Array<{
//         name: string;
//         children: Array<BubbleTreeNode>;
//     }>;
// };
// type GetBubbleTreePrams = {
//     workspaceId: string;
//     path?: string;
//     depth?: string;
// };

// export const getBubbleTreeAPI = async ({ workspaceId, depth, path = '/' }: GetBubbleTreePrams) => {
//     try {
//         if (IS_MOCK) {
//             const res = mockedBubbleTree.data as GetBubbleTreeRes;
//             return res;
//         }
//         let res;
//         if (depth)
//             res = await mongleApi.get<GetBubbleTreeRes, 'INAPPROPRIATE_DEPTH'>(
//                 `/bubble/tree/${workspaceId}?path=${path}&${depth ? 'depth=' + depth.toString() : ''}`,
//             );
//         else
//             res = await mongleApi.get<GetBubbleTreeRes, 'INAPPROPRIATE_DEPTH'>(
//                 `/bubble/tree/${workspaceId}?path=${path}`,
//             );
//         return res;
//     } catch (error: unknown) {
//         if (error instanceof APIException) {
//             if (error.code === 'INAPPROPRIATE_DEPTH') {
//                 console.error('TODO error handling');
//             }
//         }
//         throw error;
//     }
// };

type CreateBubbleReq = {
    name: string;
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
    pictures?: Array<GetPictureRes>;
    isBubblized: boolean;
    isVisible: boolean;
}

type CreateBubblePrams = {
    workspaceId: string;
    bubble: Bubble;
};
export const createBubbleAPI = async ({ workspaceId, bubble }: CreateBubblePrams): Promise<Bubble> => {
    try {
        if (IS_MOCK) {
            const res = mockedCreateBubble.data as CreateBubbleRes;
            return {
                ...res,
                pictures: [...(res.pictures?.map((picture) => pictureMapper(picture)) ?? [])],
                nameSizeInCanvas: 30,
            };
        }
        const res = await mongleApi.post<CreateBubbleReq, CreateBubbleRes, 'NO_PARENT' | 'ALREADY_EXEIST'>(
            `/bubble/${workspaceId}?path=${bubble.path}`,
            {
                top: bubble.top,
                left: bubble.left,
                height: bubble.height,
                width: bubble.width,
                name: bubble.name,
                isBubblized: bubble.isBubblized,
                isVisible: bubble.isVisible,
            },
        );

        return {
            ...res,
            pictures: [...(res.pictures?.map((picture) => pictureMapper(picture)) ?? [])],
            nameSizeInCanvas: 30,
        };
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
                isVisible: boolean;
            }>;
        };
    }>;
    create?: Array<{
        curve: {
            config: PenConfig;
            position: Array<{
                x: number;
                y: number;
                isVisible: boolean;
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
    deleteCurves?: Array<{ id: number }>;
    updateCurves?: Array<Curve>;
    createCurves?: Array<Curve>;
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
    deleteCurves,
    updateCurves,
    createCurves,
}: updateCurvePrams) => {
    try {
        if (IS_MOCK) {
            const res = mockedUpdateBubble.data as UpdateCurveRes;
            return res;
        }
        const res = await mongleApi.put<UpdateCurveReq, UpdateCurveRes, 'NO_EXEIST_BUBBLE' | 'FAIL_EXEIT'>(
            `/bubble/${workspaceId}/curve?path=${bubblePath}`,
            {
                delete: deleteCurves ?? [],
                update:
                    updateCurves?.map((curve) => {
                        return {
                            id: curve.id ?? 0,
                            curve: {
                                config: curve.config,
                                position: curve.position.map((point) => {
                                    return {
                                        x: point.x,
                                        y: point.y,
                                        isVisible: point.isVisible,
                                    };
                                }),
                            },
                        };
                    }) ?? [],
                create:
                    createCurves?.map((curve) => {
                        return {
                            curve: {
                                config: curve.config,
                                position: curve.position.map((point) => {
                                    return {
                                        x: point.x,
                                        y: point.y,
                                        isVisible: point.isVisible,
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

type ChangeNameBubbleReq = {
    name: string;
};

interface ChangeNameBubbleRes extends Rect {
    path: string;
    name: string;
    curves: Array<Curve>;
    isBubblized: boolean;
    isVisible: boolean;
}

type ChangeNameBubblePrams = {
    workspaceId: string;
    path: string;
    name: string;
};
export const changeBubbleNameAPI = async ({ workspaceId, path, name }: ChangeNameBubblePrams) => {
    try {
        if (IS_MOCK) {
            const res = mockedCreateBubble.data as ChangeNameBubbleRes;
            return res;
        }
        const res = await mongleApi.put<ChangeNameBubbleReq, ChangeNameBubbleRes, 'NO_PARENT' | 'ALREADY_EXEIST'>(
            `/bubble/${workspaceId}?path=${path}`,
            {
                name: name,
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
