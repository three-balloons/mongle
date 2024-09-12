import { useEffect, useRef } from 'react';
import { useConfigStore } from '@/store/configStore';
import { Toggle } from '@/components/toggle/Toggle';

export const AnimationToggle = () => {
    const { isShowAnimation, setIsShowAnimation } = useConfigStore((state) => state);
    const isShowAnimationRef = useRef(isShowAnimation);

    useEffect(() => {
        useConfigStore.subscribe(({ isShowAnimation }) => {
            isShowAnimationRef.current = isShowAnimation;
        });
    }, []);
    return (
        <Toggle
            state={isShowAnimationRef.current}
            toggleEvnetHandler={() => {
                setIsShowAnimation(!isShowAnimationRef.current);
            }}
        />
    );
};
