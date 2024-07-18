import { Files } from '@/pages/files/Files';
import { MainLayout } from '@/pages/layout/MainLayout';
import { Workspace } from '@/pages/workspace/Workspace';
import { Outlet, createBrowserRouter } from 'react-router-dom';

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: (
            <MainLayout>
                <Outlet />
            </MainLayout>
        ),
        children: [
            {
                path: 'workspace',
                element: <Workspace />,
            },
            {
                path: 'files',
                element: <Files />,
            },
            {
                path: '/',
                element: <Files />,
            },
        ],
    },
]);
