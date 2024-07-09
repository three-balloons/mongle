import Select from '@/headless/select/Select';
import style from '@/components/select/pen-color-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';

export const ThicknessSelect = () => {
    const { setPenThickness, penConfig } = useConfigStore((state) => state);
    return (
        <Select className={style.default}>
            <Select.Trigger>
                <div className={cn(style.circle, style.black)}>{penConfig.thickness}</div>
            </Select.Trigger>
            <Select.Content className={style.content}>
                <Select.Option
                    className={style.option}
                    value={<div className={cn(style.circle, style.black)}>7</div>}
                    onSelect={() => {
                        setPenThickness(7);
                    }}
                >
                    <div className={cn(style.circle, style.black)}>7</div>
                </Select.Option>
                <Select.Option
                    className={style.option}
                    value={<div className={cn(style.circle, style.black)}>3</div>}
                    onSelect={() => {
                        setPenThickness(3);
                    }}
                >
                    <div className={cn(style.circle, style.black)}>3</div>
                </Select.Option>
                <Select.Option
                    className={style.option}
                    value={<div className={cn(style.circle, style.black)}>1</div>}
                    onSelect={() => {
                        setPenThickness(1);
                    }}
                >
                    <div className={cn(style.circle, style.black)}>1</div>
                </Select.Option>
            </Select.Content>
        </Select>
    );
};
