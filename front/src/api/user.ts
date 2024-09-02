import { bubbleAPI } from '@/api/api';
import { APIException } from '@/api/exceptions';
import { mockedUser, mockedDeleteUser } from '@/mock/user';
const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

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
        if (IS_MOCK) {
            const res = mockedUser.data as GetUserRes;
            return res;
        } else {
            const res = await bubbleAPI.get<GetUserRes, 'USER_NOT_FOUND'>(`/user`);
            return res;
        }
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
        if (IS_MOCK) {
            const res = mockedUser.data as UpdateUserRes;
            return res;
        } else {
            const res = await bubbleAPI.put<UpdateUserReq, UpdateUserRes, 'USER_NOT_FOUND'>(`/user`, {
                name: name,
                email: email,
            });
            return res;
        }
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'USER_NOT_FOUND') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};

type DeleteUserReq = Record<string, never>;
type DeleteUserRes = {
    status: string;
};

export const deleteUserAPI = async () => {
    try {
        if (IS_MOCK) {
            const res = mockedDeleteUser.data as DeleteUserRes;
            return res;
        } else {
            const res = await bubbleAPI.put<DeleteUserReq, DeleteUserRes, 'USER_NOT_FOUND'>(`/user`, {});
            return res;
        }
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'USER_NOT_FOUND') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};
