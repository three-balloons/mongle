import { signInAPI } from '@/api/auth';
import { APIException } from '@/api/exceptions';
import style from '@/pages/signup/signup.module.css';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/util/cn';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SignUpForm = {
    id: string;
    password: string;
};

export const Signup = () => {
    const [signupForm, setLoginForm] = useState<SignUpForm>({ id: '', password: '' });
    const idInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { login, loginWithDemo } = useAuthStore((state) => state);

    const useDemoHandler = () => {
        loginWithDemo();
        navigate('/workspace');
    };

    const signInMutation = useMutation({
        mutationFn: async ({ id, password }: { id: string; password: string }) => {
            const { accessToken } = await signInAPI({ provider: 'PASS', id: id, password: password });
            return { accessToken };
        },
        onSuccess({ accessToken }) {
            login(accessToken);
            navigate('/home');
        },
        onError(error) {
            if (error instanceof APIException) {
                if (error.code === 'MEMBER_EXISTS ') {
                    console.error('이미 존재하는 회원입니다. 다시 시도해 주세요');
                    return navigate('/signup');
                }
            } else throw error;
        },
    });

    return (
        <div className={style.defualt}>
            <h1>몽글</h1>
            <div>몽글과 함께하세요!</div>
            <div className={style.signupWrapper}>
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
                            value={signupForm.id}
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
                            value={signupForm.password}
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
                    <button
                        onClick={() => {
                            if (signInMutation.status !== 'idle') return;
                            signInMutation.mutate({ id: signupForm.id, password: signupForm.password });
                        }}
                        className={cn(style.loginButtonPass)}
                    >
                        회원가입
                    </button>
                </div>
                <div className={cn(style.options)}>
                    <div className={cn(style.option)}>
                        이미 계정이 있으신가요?
                        <div className={cn(style.link)} onClick={() => navigate('/login')}>
                            로그인하기
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
