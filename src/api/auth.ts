import { mongleApi } from '@/api/mongleApi';
import { APIException } from '@/api/exceptions';
import { mockedAccessToken } from '@/mock/auth';
const IS_MOCK = import.meta.env.VITE_IS_MOCK === 'true';

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
        if (IS_MOCK) {
            const res = mockedAccessToken.data as TestLoginRes;
            return res;
        } else {
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
