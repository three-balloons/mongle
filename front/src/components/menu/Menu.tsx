import { cn } from '@/util/cn';
import style from '@/components/menu/menu.module.css';
import { PenColorSelect } from '@/components/select/penColorSelect/PenColorSelect';
import { ThicknessSelect } from '@/components/select/thicknessSelect/ThicknessSelect';
import { ToolSelect } from '@/components/select/toolSelect/ToolSelect';
import { ControlSelect } from '@/components/select/controlSelect/ControlSelect';

export const Menu = () => {
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
        </div>
    );
};
