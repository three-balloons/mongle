import Select from '@/headless/select/Select';
import style from '@/components/select/toolSelect/tool-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';

export const ToolSelect = () => {
    const { setMode, mode } = useConfigStore((state) => state);
    return (
        <Select className={style.default}>
            <Select.Trigger className={cn(style.option)}>{mode}</Select.Trigger>
            <Select.Content className={style.content}>
                <Select.Option
                    className={style.option}
                    value="move"
                    onSelect={() => {
                        setMode('move');
                    }}
                >
                    move
                </Select.Option>
                <Select.Option
                    className={style.option}
                    value="draw"
                    onSelect={() => {
                        setMode('draw');
                    }}
                >
                    draw
                </Select.Option>
                <Select.Option
                    className={style.option}
                    value="remove"
                    onSelect={() => {
                        setMode('remove');
                    }}
                >
                    remove
                </Select.Option>
            </Select.Content>
        </Select>
    );
};
