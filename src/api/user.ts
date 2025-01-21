import { mongleApi } from '@/api/mongleApi';
import { APIException } from '@/api/exceptions';

type GetUserRes = {
    oauth_id: string;
    provider: Provider;
    name: string;
    deleted_at: Date | null;
    email: string | null;
    refresh_token: string | null;
};

export const getUserAPI = async () => {
    try {
        const res = await mongleApi.get<GetUserRes, 'USER_NOT_FOUND'>(`/user`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'USER_NOT_FOUND') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type UpdateUserReq = {
    name: string;
    email: string | null;
};
type UpdateUserRes = {
    oauth_id: string;
    provider: Provider;
    name: string;
    deleted_at: Date | null;
    email: string | null;
    refresh_token: string | null;
};

export const updateUserAPI = async ({ name, email }: UpdateUserReq) => {
    try {
        const res = await mongleApi.put<UpdateUserReq, UpdateUserRes, 'USER_NOT_FOUND'>(`/user`, {
            name: name,
            email: email,
        });
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'USER_NOT_FOUND') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type DeleteUserRes = {
    status: string;
};

export const deleteUserAPI = async () => {
    try {
        const res = await mongleApi.delete<DeleteUserRes, 'USER_NOT_FOUND'>(`/user`);
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'USER_NOT_FOUND') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};
