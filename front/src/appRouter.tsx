import { Home } from '@/pages/home/Home';
import { MainLayout } from '@/pages/layout/mainLayout';
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
                element: (
                    <Routed>
                        {({ params }) => (
                            <Workspace
                                workspaceID={params.workspaceID ?? ''}
                                workSpaceName={params.workspaceName ?? '제목없음'}
                            />
                        )}
                    </Routed>
                ),
            },
            {
                path: 'files',
                element: <Home />,
            },
            {
                path: '/',
                element: <Home />,
            },
        ],
    },
]);
