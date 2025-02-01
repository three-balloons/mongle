import { pictureMapper } from '@/api/mapper/picture.mapper';
import { mockedCreateBubble, mockedDeleteBubble, mockedGetBubble, mockedUpdateBubble } from '@/mocks/data/bubble';
import { checkIsValidAccessToken } from '@/mocks/util';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

export const bubbleHandlers = [
    // getBubblesAPI
    http.get(`${API_URL}/bubble/:workspaceId`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        // const url = new URL(request.url.toString());
        // const workspaceId = url.searchParams.get('workspaceId');
        const data = mockedGetBubble;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data.map((bubble) => {
                return {
                    ...bubble,
                    pictures: [...(bubble.pictures?.map((picture) => pictureMapper(picture)) ?? [])],
                    nameSizeInCanvas: 30,
                };
            }),
        });
    }),
    // deleteBubbleAPI
    http.delete(`${API_URL}/bubble/:workspaceId`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        // const url = new URL(request.url.toString());
        // const workspaceId = url.searchParams.get('workspaceId');
        const data = mockedDeleteBubble;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    http.post(`${API_URL}/bubble/:workspaceId`, async ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);

        if (typeof accessToken !== 'string') return accessToken;
        // type RequestBodyDTO = {
        //     name: string;
        //     top: number;
        //     left: number;
        //     height: number;
        //     width: number;
        //     isBubblized: boolean;
        //     isVisible: boolean;
        // };
        // const body = (await request.json()) as RequestBodyDTO;
        // const url = new URL(request.url.toString());
        // const workspaceId = url.searchParams.get('workspaceId');
        const data = mockedCreateBubble;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: {
                ...data,
                pictures: [...(data.pictures?.map((picture) => pictureMapper(picture)) ?? [])],
                nameSizeInCanvas: 30,
            },
        });
    }),
    http.put(`${API_URL}/bubble/:workspaceId/curve`, async ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);

        if (typeof accessToken !== 'string') return accessToken;

        // const url = new URL(request.url.toString());
        // const workspaceId = url.searchParams.get('workspaceId');
        const data = mockedUpdateBubble;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    http.put(`${API_URL}/bubble/:workspaceId/change_info`, async ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);

        if (typeof accessToken !== 'string') return accessToken;

        // const url = new URL(request.url.toString());
        // const workspaceId = url.searchParams.get('workspaceId');
        const data = mockedCreateBubble;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
];
