import { AnimationToggle } from '@/components/toggle/animationToggle/AnimationToggle';
import { BubbleToggle } from '@/components/toggle/bubbleToggle/BubbleToggle';
import { TouchDrawToggle } from '@/components/toggle/touchDrawToggle/TouchDrawToggle';
import style from '@/pages/home/setting/setting.module.css';
import { cn } from '@/util/cn';
import { useNavigate } from 'react-router-dom';

export const Setting = () => {
    const navigate = useNavigate();
    return (
        <div className={style.default}>
            <h1>환경 설정</h1>
            <div className={style.settings}>
                <div className={style.setting}>
                    애니메이션 <AnimationToggle />
                </div>
                <div className={style.setting}>
                    버블 테두리 보여줌 <BubbleToggle />
                </div>
                <div className={style.setting}>
                    손가락으로 그리기 <TouchDrawToggle />
                </div>
                <div className={style.line} />
                <div className={cn(style.setting, style.clickable)} onClick={() => alert('이용약관 준비중입니다')}>
                    이용약관
                </div>
                <div className={style.line} />
                <div className={cn(style.setting, style.clickable)} onClick={() => navigate('/privacy')}>
                    개인정보 정책
                </div>
            </div>
        </div>
    );
};
