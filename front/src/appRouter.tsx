import { Home } from '@/pages/home/Home';
import { MainLayout } from '@/pages/layout/mainLayout';
import { Google } from '@/pages/login/google/Google';
import { Kakao } from '@/pages/login/kakao/Kakao';
import { Login } from '@/pages/login/Login';
import { Workspace } from '@/pages/workspace/Workspace';
import { Routed } from '@/Routed';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Pass } from '@/pages/login/pass/Pass';
import { Signup } from '@/pages/signup/Signup';

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
                                workspaceName={params.workspaceName ?? '제목없음'}
                            />
                        )}
                    </Routed>
                ),
            },
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'login',
                children: [
                    { path: '', element: <Login /> },
                    {
                        path: 'kakao',
                        element: <Kakao />,
                    },
                    {
                        path: 'google',
                        element: <Google />,
                    },
                    {
                        path: 'pass',
                        element: (
                            <Routed>
                                {({ searchParam }) => {
                                    const state = searchParam.get('state');
                                    if (state == null) return <Pass />;
                                    return;
                                }}
                            </Routed>
                        ),
                    },
                    {
                        path: 'signup',
                        element: <Signup />,
                    },
                ],
            },
            {
                path: '/',
                element: <Login />,
            },
        ],
    },
]);
