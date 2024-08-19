import style from '@/pages/signup/signup.module.css';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/util/cn';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type SignUpForm = {
    id: string;
    password: string;
};

/**
 * 현재 사용되지 않는 페이지
 * 추후 소셜로그인 후 추가 정보 입력 페이지로 사용
 */
export const Signup = () => {
    const [signupForm, setLoginForm] = useState<SignUpForm>({ id: '', password: '' });
    const idInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { loginWithDemo } = useAuthStore((state) => state);

    const useDemoHandler = () => {
        loginWithDemo();
        navigate('/workspace/demo');
    };

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
