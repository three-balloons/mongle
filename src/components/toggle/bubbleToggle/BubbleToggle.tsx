import { useEffect, useRef } from 'react';
import { useConfigStore } from '@/store/configStore';
import { Toggle } from '@/components/toggle/Toggle';

export const BubbleToggle = () => {
    const { isShowBubble, setIsShowBubble } = useConfigStore((state) => state);
    const isShowBubbleRef = useRef(isShowBubble);

    useEffect(() => {
        useConfigStore.subscribe(({ isShowAnimation }) => {
            isShowBubbleRef.current = isShowAnimation;
        });
    }, []);
    return (
        <Toggle
            state={isShowBubbleRef.current}
            toggleEvnetHandler={() => {
                setIsShowBubble(!isShowBubbleRef.current);
            }}
        />
    );
};
