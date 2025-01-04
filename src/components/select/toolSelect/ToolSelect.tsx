import Select from '@/headless/select/Select';
import style from '@/components/select/toolSelect/tool-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';
import { ReactComponent as PenIcon } from '@/assets/icon/pen.svg';
import { ReactComponent as HandIcon } from '@/assets/icon/hand.svg';
import { ReactComponent as EraserIcon } from '@/assets/icon/eraser.svg';
import { ReactComponent as AddBubbleIcon } from '@/assets/icon/add-rectangle.svg';
import { ReactComponent as SelectIcon } from '@/assets/icon/select.svg';
import { EraserModal } from '@/components/select/toolSelect/EraserModal';
import { useTutorial } from '@/components/tutorial/useTutorial';

export const ToolSelect = () => {
    const { setMode, mode } = useConfigStore((state) => state);
    const { addBubbleIconRef, penIconRef, eraserIconRef, handIconRef } = useTutorial();
    return (
        <Select className={style.default} initialOpen disableClose>
            <Select.Content className={style.content}>
                <div ref={handIconRef}>
                    <Select.Option
                        className={cn(style.option, mode === 'move' && style.activeOption)}
                        value="move"
                        onSelect={() => {
                            setMode('move');
                        }}
                    >
                        <HandIcon className={style.icon} />
                    </Select.Option>
                </div>
                <div ref={penIconRef}>
                    <Select.Option
                        className={cn(style.option, mode === 'draw' && style.activeOption)}
                        value="draw"
                        onSelect={() => {
                            setMode('draw');
                        }}
                    >
                        <PenIcon className={style.icon} />
                    </Select.Option>
                </div>
                <div ref={eraserIconRef}>
                    <Select.Option
                        className={cn(style.option, mode === 'erase' && style.activeOption)}
                        value="erase"
                        onSelect={() => {
                            setMode('erase');
                        }}
                    >
                        {mode == 'erase' ? <EraserModal /> : <EraserIcon className={style.icon} />}
                    </Select.Option>
                </div>
                <div ref={addBubbleIconRef}>
                    <Select.Option
                        className={cn(style.option, mode === 'bubble' && style.activeOption)}
                        value="bubble"
                        onSelect={() => {
                            setMode('bubble');
                        }}
                    >
                        <AddBubbleIcon className={style.icon} />
                    </Select.Option>
                </div>
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
