import { bubbleAPI } from '@/api/api';
import { APIException } from '@/api/exceptions';
import { mockedAccessToken } from '@/mock/auth';
const IS_MOCK = import.meta.env.VITE_IS_MOCK;

type GetAccessTokenReq = {
    provider: Provider;
    password?: string;
    email?: string;
    code?: string;
    redirect_uri?: string;
};
type GetAccessTokenRes = {
    accessToken: string;
};

export const getAccessTokenAPI = async ({ provider, code, redirect_uri }: GetAccessTokenReq) => {
    try {
        if (IS_MOCK) {
            const res = mockedAccessToken.data as GetAccessTokenRes;
            return res;
        } else {
            const res = await bubbleAPI.post<
                GetAccessTokenReq,
                GetAccessTokenRes,
                'INAPPROPRIATE_PAYLOAD' | 'SIGN_UP_NEEDED' | 'NOT_MATCH_PASSWORD'
            >(`/auth/access`, {
                provider: provider,
                code: code,
                redirect_uri: redirect_uri,
            });
            return res;
        }
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (
                error.code === 'INAPPROPRIATE_PAYLOAD' ||
                error.code === 'SIGN_UP_NEEDED' ||
                error.code === 'NOT_MATCH_PASSWORD'
            ) {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};
