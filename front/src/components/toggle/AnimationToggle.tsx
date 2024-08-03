import { cn } from '@/util/cn';
import style from '@/components/toggle/animation-toggle.module.css';
import { useEffect, useRef } from 'react';
import { useConfigStore } from '@/store/configStore';

export const AnimationToggle = () => {
    const { isShowAnimation, setIsShowAnimation } = useConfigStore((state) => state);
    const isShowAnimationRef = useRef(isShowAnimation);

    useEffect(() => {
        useConfigStore.subscribe(({ isShowAnimation }) => {
            isShowAnimationRef.current = isShowAnimation;
        });
    }, []);

    const toggleHandler = () => {
        // isOn의 상태를 변경하는 메소드를 구현
        setIsShowAnimation(!isShowAnimationRef.current);
    };
    return (
        <div onClick={toggleHandler} className={style.default}>
            <div className={cn(style.container, isShowAnimationRef.current && style.isContainerChecked)}></div>
            <div className={cn(style.circle, isShowAnimationRef.current && style.isCircleChecked)}></div>
        </div>
    );
};
