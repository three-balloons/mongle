import style from '@/components/select/weightSelect/weight-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { useEffect, useRef } from 'react';
import { ThicknessSelect } from '@/components/select/weightSelect/ThicknessSelect';
import { RadiusSelect } from '@/components/select/weightSelect/RadiusSelect';

export const WeightSelect = () => {
    const { mode } = useConfigStore((state) => state);
    const modeRef = useRef(mode);

    useEffect(() => {
        useConfigStore.subscribe(({ mode }) => {
            modeRef.current = mode;
        });
    }, []);
    if (modeRef.current == 'draw') return <ThicknessSelect />;
    else if (modeRef.current == 'erase') return <RadiusSelect />;
    else return <div className={style.default}></div>;
};
