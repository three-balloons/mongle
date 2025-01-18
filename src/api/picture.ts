import { APIException } from '@/api/exceptions';
import { mongleApi } from '@/api/mongleApi';

export type GetPictureRes = {
    id: string;
    top: number;
    left: number;
    width: number;
    height: number;
    fid: string;
    isFlippedX: boolean;
    isFlippedY: boolean;
    angle: number;
};

export const getPictureAPI = async (workspaceId: string, pictureId: string) => {
    try {
        const res = await mongleApi.get<GetPictureRes, 'WORKSPACE_NOT_FOUND'>(`/${workspaceId}/pictures/${pictureId}`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'WORKSPACE_NOT_FOUND') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type DeletePictureRes = {
    id: string;
};

export const deleteBubbleAPI = async (workspaceId: string, pictureId: string) => {
    try {
        const res = await mongleApi.delete<DeletePictureRes, 'WORKSPACE_NOT_FOUND'>(
            `/${workspaceId}/pictures/${pictureId}`,
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'WORKSPACE_NOT_FOUND') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

interface CreatePictureReq extends Rect {
    isFlippedX: boolean;
    isFlippedY: boolean;
    angle: number; // degree [0, 360)
    path: string;
    fid: string;
}
interface CreatePictureRes extends Rect {
    id: string;
    isFlippedX: boolean;
    isFlippedY: boolean;
    angle: number; // degree [0, 360)
    path: string;
    fid: string;
}

type CreatePicturePrams = {
    workspaceId: string;
    left: number;
    top: number;
    width: number;
    height: number;
    isFlippedX: boolean;
    isFlippedY: boolean;
    angle: number;
    path: string;
    fid: string;
};
export const createPictureAPI = async ({
    workspaceId,
    left,
    top,
    width,
    height,
    isFlippedX,
    isFlippedY,
    angle,
    path,
    fid,
}: CreatePicturePrams) => {
    try {
        const res = await mongleApi.post<CreatePictureReq, CreatePictureRes, 'NO_PARENT' | 'ALREADY_EXEIST'>(
            `/${workspaceId}/pictures`,
            {
                left,
                top,
                width,
                height,
                isFlippedX,
                isFlippedY,
                angle,
                path,
                fid,
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
