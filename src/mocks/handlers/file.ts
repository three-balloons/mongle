import { mockedUploadFile } from '@/mocks/data/file';
import { mockedPicture } from '@/mocks/data/picture';
import { checkIsValidAccessToken } from '@/mocks/util';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

export const pictureHandlers = [
    // uploadFileAPI
    http.get(`${API_URL}/files/temporary`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;

        const data = mockedUploadFile;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // getFileAPI
    http.get(`${API_URL}/files/:fid`, async ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const svgFileUrl = '/mongle-logo.svg';
        const response = await fetch(svgFileUrl);
        const svgBlob = await response.blob();

        return HttpResponse.json(
            { code: 'OK', message: 'OK', data: svgBlob },
            { headers: { 'Content-Type': 'image/svg+xml' }, status: 200 },
        );
    }),
    // createPictureAPI
    http.post(`${API_URL}/:workspceId/pictures`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedPicture;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
];
