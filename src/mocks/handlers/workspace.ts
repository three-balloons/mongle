import {
    mockedCreateWorkspace,
    mockedDeleteWorkspace,
    mockedGetDeletedWorkspaces,
    mockedGetWorkspace,
    mockedGetWorkspaces,
    mockedUpdateWorkspace,
} from '@/mocks/data/workspace';
import { checkIsValidAccessToken } from '@/mocks/util';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

export const workspaceHandlers = [
    // getWorkspaceAPI
    http.get(`${API_URL}/workspace/:workspaceId`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedGetWorkspace;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // getAllWorkspaceAPI
    http.get(`${API_URL}/workspace`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedGetWorkspaces;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // updateWorkspaceAPI
    http.put(`${API_URL}/workspace/:workspaceId`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedUpdateWorkspace;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // deleteWorkspaceAPI
    http.delete(`${API_URL}/workspace/:workspaceId`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedDeleteWorkspace;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // createWorkspaceAPI
    http.post(`${API_URL}/workspace`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedCreateWorkspace;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
    // getDeletedWorkspaceAPI
    http.get(`${API_URL}/workspace/deleted`, ({ request }) => {
        const authorizationHeader = request.headers.get('Authorization');
        const accessToken = checkIsValidAccessToken(authorizationHeader);
        if (typeof accessToken !== 'string') return accessToken;
        const data = mockedGetDeletedWorkspaces;

        return HttpResponse.json({
            code: 'OK',
            message: 'OK',
            data: data,
        });
    }),
];
