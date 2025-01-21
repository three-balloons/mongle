import { mongleApi } from '@/api/mongleApi';
import { APIException } from '@/api/exceptions';

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
        const res = await mongleApi.post<
            GetAccessTokenReq,
            GetAccessTokenRes,
            'INAPPROPRIATE_PAYLOAD' | 'SIGN_UP_NEEDED' | 'NOT_MATCH_PASSWORD'
        >(`/auth/access`, {
            provider: provider,
            code: code,
            redirect_uri: redirect_uri,
        });
        return res;
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

type TestLoginReq = {
    provider: Provider;
    oauth_id: string;
    name: string;
};
type TestLoginRes = {
    accessToken: string;
};

export const testLoginAPI = async ({ provider, oauth_id, name }: TestLoginReq) => {
    try {
        const res = await mongleApi.post<
            TestLoginReq,
            TestLoginRes,
            'INAPPROPRIATE_PAYLOAD' | 'SIGN_UP_NEEDED' | 'NOT_MATCH_PASSWORD'
        >(`/auth/test`, {
            provider: provider,
            oauth_id: oauth_id,
            name: name,
        });
        return res;
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
