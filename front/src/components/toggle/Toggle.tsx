import { cn } from '@/util/cn';
import style from '@/components/toggle/toggle.module.css';
import { useState } from 'react';

type ToggleProps = {
    state: boolean;
    toggleEvnetHandler: () => void;
};
export const Toggle = ({ state, toggleEvnetHandler }: ToggleProps) => {
    const [isOn, setIsOn] = useState(state);

    const toggleHandler = () => {
        toggleEvnetHandler();
        setIsOn(!isOn);
    };
    return (
        <div onClick={toggleHandler} className={style.default}>
            <div className={cn(style.container, isOn && style.isContainerChecked)}></div>
            <div className={cn(style.circle, isOn && style.isCircleChecked)}></div>
        </div>
    );
};
