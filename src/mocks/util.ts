import { HttpResponse, JsonBodyType, StrictResponse } from 'msw';

export const checkIsValidAccessToken = (authorizationHeader: string | null): StrictResponse<JsonBodyType> | string => {
    if (!authorizationHeader) {
        return HttpResponse.json({
            status: 'BAD_REQUEST',
            resultCode: 'NO_TOKEN',
            message: '헤더에 토큰이 없습니다.',
        });
    }
    if (!authorizationHeader.startsWith('Bearer ')) {
        return HttpResponse.json({
            status: 'BAD_REQUEST',
            resultCode: 'ACCESS_TOKEN_NOT_VALID',
            message: '토큰에 문제가 있습니다.',
        });
    }
    return authorizationHeader.slice(7);
};
