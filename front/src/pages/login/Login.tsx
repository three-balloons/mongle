import style from '@/pages/login/login.module.css';
import { cn } from '@/util/cn';
import { ReactComponent as GoogleIcon } from '@/assets/icon/login-google.svg';
import { ReactComponent as KakaoIcon } from '@/assets/icon/login-kakao.svg';
import { KAKAO_LOGIN_URL } from '@/pages/login/kakao/Kakao';
import { GOOGLE_LOGIN_URL } from '@/pages/login/google/Google';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import logo from '@/assets/img/mongle-logo.png';

export const Login = () => {
    const navigate = useNavigate();
    const { loginWithDemo } = useAuthStore((state) => state);

    const useDemoHandler = () => {
        loginWithDemo();
        navigate('/workspace/demo', { replace: true });
    };

    return (
        <div className={style.defualt}>
            <img src={logo} className={style.logo}></img>
            <div className={style.slogan}>손글씨로 담아낸 몽글몽글한 순간!</div>
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
                <div className={cn(style.options)}>
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
