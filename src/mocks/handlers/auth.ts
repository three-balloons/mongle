import { mockedAccessToken } from '@/mocks/data/auth';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

export const authHandlers = [
    // getAccessTokenAPI
    http.post(`${API_URL}/auth/access`, () => {
        const data = mockedAccessToken;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // testLoginAPI
    http.post(`${API_URL}/auth/test`, () => {
        const data = mockedAccessToken;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
];
