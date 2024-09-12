import { AnimationToggle } from '@/components/toggle/animationToggle/AnimationToggle';
import { BubbleToggle } from '@/components/toggle/bubbleToggle/BubbleToggle';
import style from '@/pages/home/setting/setting.module.css';

export const Setting = () => {
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
                <div className={style.line} />
                <div className={style.setting}>이용약관</div>
                <div className={style.line} />
                <div className={style.setting}>개인정보 정책</div>
            </div>
        </div>
    );
};
