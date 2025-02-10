import { mockedDeletePicture, mockedPicture } from '@/mocks/data/picture';
import { checkIsValidAccessToken } from '@/mocks/util';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

export const pictureHandlers = [
    // getPictureAPI
    http.get(`${API_URL}/pictures/:pictureId`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        if (!request.headers.get('workspaceId'))
            return HttpResponse.json({
                code: 'WORKSPACE_NOT_FOUND',
                message: '작업공간이 존재하지 않습니다',
                data: null,
            });

        const data = mockedPicture;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // deletePictureAPI
    http.delete(`${API_URL}/pictures/:pictureId`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        if (!request.headers.get('workspaceId'))
            return HttpResponse.json({
                code: 'WORKSPACE_NOT_FOUND',
                message: '작업공간이 존재하지 않습니다',
                data: null,
            });
        const data = mockedDeletePicture;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // createPictureAPI
    http.post(`${API_URL}/pictures`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        if (!request.headers.get('workspaceId'))
            return HttpResponse.json({
                code: 'WORKSPACE_NOT_FOUND',
                message: '작업공간이 존재하지 않습니다',
                data: null,
            });
        const data = mockedPicture;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    http.patch(`${API_URL}/pictures/:pictureId/restore`, async ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        if (!request.headers.get('workspaceId'))
            return HttpResponse.json({
                code: 'WORKSPACE_NOT_FOUND',
                message: '작업공간이 존재하지 않습니다',
                data: null,
            });

        const data = { id: 234 };
        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
];
