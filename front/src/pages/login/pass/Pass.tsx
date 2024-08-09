import { getAccessTokenAPI } from '@/api/auth';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import style from '@/pages/login/kakao/kakao.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

import { APIException } from '@/api/exceptions';
import { useAuthStore } from '@/store/authStore';

type PassLoginProps = {
    id: string;
    password: string;
};
export const Pass = () => {
    const location = useLocation();
    const { id, password } = location.state;
    const navigate = useNavigate();
    const { login } = useAuthStore((state) => state);
    const loginMutation = useMutation({
        mutationFn: async ({ id, password }: PassLoginProps) => {
            const { accessToken } = await getAccessTokenAPI({ provider: 'PASS', id: id, password: password });

            return { accessToken };
        },
        onSuccess({ accessToken }) {
            login(accessToken);
            navigate('/home');
        },
        onError(error) {
            if (error instanceof APIException) {
                if (error.code === 'SIGN_UP_NEEDED') {
                    return navigate('/login');
                }
            } else throw error;
        },
    });

    useEffect(() => {
        (async () => {
            if (loginMutation.status !== 'idle') return;
            if (id === undefined || password == undefined) return;
            loginMutation.mutate({ id, password });
        })();
    }, [loginMutation]);

    if (loginMutation.status === 'pending' || loginMutation.status === 'idle') {
        return <div>로그인 중입니다</div>;
    }
    if (loginMutation.status === 'error') {
        return (
            <div className={style.default}>
                <p>로그인 중 오류가 발생했습니다.</p>
            </div>
        );
    }
};
