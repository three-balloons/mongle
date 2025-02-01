import { mockedDeleteUser, mockedUser } from '@/mocks/data/user';
import { checkIsValidAccessToken } from '@/mocks/util';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

export const userHandlers = [
    // getUserAPI
    http.get(`${API_URL}/user`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedUser;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // updateUserAPI
    http.put(`${API_URL}/user`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedUser;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // deleteUserAPI
    http.delete(`${API_URL}/user`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedDeleteUser;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
];
