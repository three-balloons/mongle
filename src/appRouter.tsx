import { Home } from '@/pages/home/Home';
import { MainLayout } from '@/pages/layout/mainLayout';
import { Google } from '@/pages/login/google/Google';
import { Kakao } from '@/pages/login/kakao/Kakao';
import { Login } from '@/pages/login/Login';
import { Workspace } from '@/pages/workspace/Workspace';
import { Routed } from '@/Routed';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Signup } from '@/pages/signup/Signup';
import { Privacy } from '@/pages/privacy/Privacy';
import { Admin } from '@/pages/login/admin/Admin';
import { TermOfUse } from '@/pages/termOfUse/TermOfUse';

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
                path: 'workspace/:workspaceId',
                element: <Routed>{({ params }) => <Workspace workspaceId={params.workspaceId ?? ''} />}</Routed>,
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
                        path: 'admin',
                        element: <Admin />,
                    },
                    {
                        path: 'signup',
                        element: <Signup />,
                    },
                ],
            },
            {
                path: '/privacy',
                element: <Privacy />,
            },
            {
                path: '/term-of-use',
                element: <TermOfUse />,
            },
            {
                path: '/',
                element: <Login />,
            },
        ],
    },
]);
