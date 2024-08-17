import { bubbleAPI } from '@/api/api';
import { APIException } from '@/api/exceptions';
import { mockedAccessToken, mockedsignIn } from '@/mock/auth';
const IS_MOCK = import.meta.env.VITE_IS_MOCK;

type GetAccessTokenReq = {
    provider: Provider;
    password?: string;
    id?: string;
    code?: string;
};
type GetAccessTokenRes = {
    accessToken: string;
};

export const getAccessTokenAPI = async ({ provider, password, id, code }: GetAccessTokenReq) => {
    try {
        if (IS_MOCK) {
            const res = mockedAccessToken.data as GetAccessTokenRes;
            return res;
        }
        const res = await bubbleAPI.post<
            GetAccessTokenReq,
            GetAccessTokenRes,
            'INAPPROPRIATE_PAYLOAD' | 'SIGN_UP_NEEDED' | 'NOT_MATCH_PASSWORD'
        >(`/auth/access`, { provider: provider, password: password, id: id, code: code });
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

type SignInReq = {
    provider: Provider;
    password: string;
    id: string;
};
type SignInRes = {
    provider: Provider;
    auth_id: string;
    name: string;
    accessToken: string;
};
export const signInAPI = async ({ provider, password, id }: SignInReq) => {
    try {
        if (IS_MOCK) {
            const res = mockedsignIn.data as SignInRes;
            return res;
        }
        const res = await bubbleAPI.post<SignInReq, SignInRes, 'INAPPROPRIATE_PAYLOAD' | 'MEMBER_EXISTS'>(
            `/auth/access`,
            { provider: provider, password: password, id: id },
        );
        return res;
    } catch (error: unknown) {
        if (error instanceof APIException) {
            if (error.code === 'INAPPROPRIATE_PAYLOAD' || error.code === 'MEMBER_EXISTS') {
                console.error('TODO error handling');
            }
        }
        throw error;
    }
};
