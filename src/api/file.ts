import { APIException } from '@/api/exceptions';
import { mongleApi } from '@/api/mongleApi';

interface UploadFileRes {
    fid: string;
}

export const uploadFileAPI = async (imgFormData: FormData) => {
    try {
        const res = await mongleApi.post<FormData, UploadFileRes, 'NOT_SUPPORTED' | 'FILE_TOO_LARGE'>(
            '/files/temporary ',
            imgFormData,
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'NOT_SUPPORTED' || error.code === 'FILE_TOO_LARGE') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type GetFileRes = Blob;

export const getFileAPI = async (fid: string) => {
    try {
        const res = await mongleApi.get<GetFileRes, 'FILE_NOT_FOUND' | 'FORBIDDEN'>(`/files/${fid}`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'FILE_NOT_FOUND' || error.code === 'FILE_TOO_LARGE') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};
