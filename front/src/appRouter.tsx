import { Files } from '@/pages/files/Files';
import { MainLayout } from '@/pages/layout/MainLayout';
import { Workspace } from '@/pages/workspace/Workspace';
import { Routed } from '@/Routed';
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
                path: 'workspace/:workspaceID',
                element: <Routed>{({ params }) => <Workspace workspaceID={params.workspaceID ?? ''} />}</Routed>,
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
