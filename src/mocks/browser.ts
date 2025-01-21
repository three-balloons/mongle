import { setupWorker } from 'msw/browser';
import { bubbleHandlers } from '@/mocks/handlers/bubble';
import { authHandlers } from '@/mocks/handlers/auth';
import { workspaceHandlers } from '@/mocks/handlers/workspace';
import { userHandlers } from '@/mocks/handlers/user';
import { pictureHandlers } from '@/mocks/handlers/picture';

export const worker = setupWorker(
    ...bubbleHandlers,
    ...authHandlers,
    ...workspaceHandlers,
    ...userHandlers,
    ...pictureHandlers,
);
