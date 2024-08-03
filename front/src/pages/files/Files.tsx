import style from '@/pages/files/files.module.css';
// import { FreeView } from '@/pages/files/FreeView';
import { GridView } from '@/pages/files/GridView';
import { AnimationToggle } from '@/components/toggle/AnimationToggle';

export const Files = () => {
    return (
        <div className={style.default}>
            <div className={style.view}>
                {/* <FreeView /> */}
                <GridView />
                <div className={style.animationToggle}>
                    애니메이션 설정 <AnimationToggle></AnimationToggle>
                </div>
            </div>
        </div>
    );
};
