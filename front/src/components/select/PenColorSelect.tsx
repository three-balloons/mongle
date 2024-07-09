import Select from '@/headless/select/Select';
import style from '@/components/select/pen-color-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';

export const PenColorSelect = () => {
    const { setPenColor, penConfig } = useConfigStore((state) => state);
    return (
        <Select className={style.default}>
            <Select.Trigger>
                <div className={cn(style.circle)} style={penConfig.color && { backgroundColor: penConfig.color }}></div>
            </Select.Trigger>
            <Select.Content className={style.content}>
                <Select.Option
                    className={style.option}
                    value={<div className={cn(style.circle, style.yellow)}></div>}
                    onSelect={() => {
                        setPenColor('yellow');
                    }}
                >
                    <div className={cn(style.circle, style.yellow)}></div>
                </Select.Option>
                <Select.Option
                    className={style.option}
                    value={<div className={cn(style.circle, style.red)} />}
                    onSelect={() => {
                        setPenColor('red');
                    }}
                >
                    <div className={cn(style.circle, style.red)} />
                </Select.Option>
                <Select.Option
                    className={style.option}
                    value={<div className={cn(style.circle, style.black)}></div>}
                    onSelect={() => {
                        setPenColor('black');
                    }}
                >
                    <div className={cn(style.circle, style.black)}></div>
                </Select.Option>
            </Select.Content>
        </Select>
    );
};
