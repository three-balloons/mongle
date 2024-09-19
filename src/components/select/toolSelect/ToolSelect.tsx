import Select from '@/headless/select/Select';
import style from '@/components/select/toolSelect/tool-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';
import { ReactComponent as PenIcon } from '@/assets/icon/pen.svg';
import { ReactComponent as HandIcon } from '@/assets/icon/hand.svg';
import { ReactComponent as EraserIcon } from '@/assets/icon/eraser.svg';
import { ReactComponent as BubbleGunIcon } from '@/assets/icon/bubble-gun.svg';
import { ReactComponent as SelectIcon } from '@/assets/icon/select.svg';
import { EraserModal } from '@/components/select/toolSelect/EraserModal';

export const ToolSelect = () => {
    const { setMode, mode } = useConfigStore((state) => state);
    return (
        <Select className={style.default} initialOpen disableClose>
            <Select.Content className={style.content}>
                <Select.Option
                    className={cn(style.option, mode === 'move' && style.activeOption)}
                    value="move"
                    onSelect={() => {
                        setMode('move');
                    }}
                >
                    <HandIcon className={style.icon} />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'draw' && style.activeOption)}
                    value="draw"
                    onSelect={() => {
                        setMode('draw');
                    }}
                >
                    <PenIcon className={style.icon} />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'erase' && style.activeOption)}
                    value="erase"
                    onSelect={() => {
                        setMode('erase');
                    }}
                >
                    {mode == 'erase' ? <EraserModal /> : <EraserIcon className={style.icon} />}
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'bubble' && style.activeOption)}
                    value="bubble"
                    onSelect={() => {
                        setMode('bubble');
                    }}
                >
                    <BubbleGunIcon className={style.icon} />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'edit' && style.activeOption)}
                    value="edit"
                    onSelect={() => {
                        setMode('edit');
                    }}
                >
                    <SelectIcon className={style.icon} />
                </Select.Option>
            </Select.Content>
        </Select>
    );
};
