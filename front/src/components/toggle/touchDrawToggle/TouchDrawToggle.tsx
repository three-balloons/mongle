import { useEffect, useRef } from 'react';
import { useConfigStore } from '@/store/configStore';
import { Toggle } from '@/components/toggle/Toggle';

export const TouchDrawToggle = () => {
    const { isTouchDraw, setIsTouchDraw } = useConfigStore((state) => state);
    const isTouchDrawRef = useRef(isTouchDraw);

    useEffect(() => {
        useConfigStore.subscribe(({ isTouchDraw }) => {
            isTouchDrawRef.current = isTouchDraw;
        });
    }, []);
    return (
        <Toggle
            state={isTouchDrawRef.current}
            toggleEvnetHandler={() => {
                setIsTouchDraw(!isTouchDrawRef.current);
            }}
        />
    );
};
