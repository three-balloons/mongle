import { cn } from '@/util/cn';
import style from '@/components/menu/menu.module.css';
import { PenColorSelect } from '@/components/select/penColorSelect/PenColorSelect';
import { ThicknessSelect } from '@/components/select/thicknessSelect/ThicknessSelect';
import { ToolSelect } from '@/components/select/toolSelect/ToolSelect';
import { ControlSelect } from '@/components/select/controlSelect/ControlSelect';
import { useState } from 'react';

type MenuProps = {
    workSpaceResizeHandler: () => void;
};
export const Menu = ({ workSpaceResizeHandler }: MenuProps) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className={cn(style.default)}>
            <div className={cn(style.config)}>
                <PenColorSelect />
                <ThicknessSelect />
                <ToolSelect />
            </div>
            <div className={cn(style.command)}>
                <ControlSelect />
            </div>
            <div
                onClick={() => {
                    workSpaceResizeHandler();
                    setIsOpen(!isOpen);
                }}
                className={style.explorerButton}
            >
                {isOpen ? '탐색기 열기' : '탐색기 닫기'}
            </div>
        </div>
    );
};
