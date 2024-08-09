import style from '@/pages/login/login.module.css';
import { cn } from '@/util/cn';
import { ReactComponent as GoogleIcon } from '@/assets/icon/login-google.svg';
import { ReactComponent as KakaoIcon } from '@/assets/icon/login-kakao.svg';
import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { KAKAO_LOGIN_URL } from '@/pages/login/kakao/Kakao';
import { GOOGLE_LOGIN_URL } from '@/pages/login/google/Google';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { APIException } from '@/api/exceptions';
import { getAccessTokenAPI } from '@/api/auth';

type LoginForm = {
    id: string;
    password: string;
};

export const Login = () => {
    const [loginForm, setLoginForm] = useState<LoginForm>({ id: '', password: '' });
    const idInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { login, loginWithDemo } = useAuthStore((state) => state);

    const useDemoHandler = () => {
        loginWithDemo();
        navigate('/workspace');
    };

    const loginMutation = useMutation({
        mutationFn: async ({ id, password }: { id: string; password: string }) => {
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

    return (
        <div className={style.defualt}>
            <h1>몽글</h1>
            <div>몽글몽글한 손필기 노트!</div>
            <div className={style.loginWrapper}>
                <button
                    onClick={() => window.location.assign(GOOGLE_LOGIN_URL)}
                    className={cn(style.loginButton, style.google)}
                >
                    <GoogleIcon className={cn(style.icon, style.iconGoogle)} />
                    <span>구글로 시작하기</span>
                    <div className={style.empty}></div>
                </button>
                <button
                    onClick={() => window.location.assign(KAKAO_LOGIN_URL)}
                    className={cn(style.loginButton, style.kakao)}
                >
                    <KakaoIcon className={style.icon} />
                    <span>카카오로 시작하기</span>
                    <div className={style.empty}></div>
                </button>
                <div>or</div>
                <div className={cn(style.loginPass)}>
                    <div
                        className={cn(style.formInput)}
                        onClick={() => {
                            idInputRef.current?.focus();
                        }}
                    >
                        <label>아이디</label>
                        <input
                            type="text"
                            enterKeyHint="done"
                            value={loginForm.id}
                            ref={idInputRef}
                            placeholder="아이디를 입력하세요"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.currentTarget.blur();
                            }}
                            onChange={(e) => {
                                e.preventDefault();
                                setLoginForm((prev) => ({ ...prev, id: e.target.value }));
                            }}
                        />
                    </div>
                    <div
                        className={cn(style.formInput)}
                        onClick={() => {
                            passwordInputRef.current?.focus();
                        }}
                    >
                        <label>비밀번호</label>
                        <input
                            type="password"
                            enterKeyHint="done"
                            value={loginForm.password}
                            ref={passwordInputRef}
                            placeholder="비밀번호를 입력하세요"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.currentTarget.blur();
                            }}
                            onChange={(e) => {
                                e.preventDefault();
                                setLoginForm((prev) => ({ ...prev, password: e.target.value }));
                            }}
                        />
                    </div>
                    <div className={style.loginError}>
                        {loginMutation.error && '아이디나 비밀번호가 잘못되었습니다'}
                    </div>
                    <button
                        onClick={() => {
                            if (loginMutation.status !== 'idle') return;
                            loginMutation.mutate({ id: loginForm.id, password: loginForm.password });
                        }}
                        className={cn(style.loginButtonPass)}
                    >
                        로그인
                    </button>
                </div>
                <div className={cn(style.options)}>
                    <div className={cn(style.option)}>
                        이미 계정이 있으신가요?
                        <div className={cn(style.link)} onClick={() => navigate('/login/signup')}>
                            회원가입하기
                        </div>
                    </div>
                    <div className={cn(style.option)}>
                        체험이 필요하신가요?
                        <div className={cn(style.option, style.link)} onClick={useDemoHandler}>
                            로그인 없이 이용
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
