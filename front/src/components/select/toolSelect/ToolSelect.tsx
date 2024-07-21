import Select from '@/headless/select/Select';
import style from '@/components/select/toolSelect/tool-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';
import pen from '@/assets/icon/pen.svg';
import hand from '@/assets/icon/hand.svg';
import eraser from '@/assets/icon/eraser.svg';
import bubbleGun from '@/assets/icon/bubble-gun.svg';
import { EraserModal } from '@/components/select/toolSelect/EraserModal';

const Icon = ({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img className={cn(className)} src={src} alt={alt} {...props}></img>;
};

export const EraserIcon = () => {
    return <Icon src={eraser} className={style.icon} />;
};

export const BubbleGunIcon = () => {
    return <Icon src={bubbleGun} className={style.icon} />;
};

export const PenIcon = () => {
    return <Icon src={pen} className={style.icon} />;
};

export const HandIcon = () => {
    return <Icon src={hand} className={style.icon} />;
};

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
                    <HandIcon />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'draw' && style.activeOption)}
                    value="draw"
                    onSelect={() => {
                        setMode('draw');
                    }}
                >
                    <PenIcon />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'erase' && style.activeOption)}
                    value="erase"
                    onSelect={() => {
                        setMode('erase');
                    }}
                >
                    {mode == 'erase' ? <EraserModal /> : <EraserIcon />}
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'bubble' && style.activeOption)}
                    value="bubble"
                    onSelect={() => {
                        setMode('bubble');
                    }}
                >
                    <BubbleGunIcon />
                </Select.Option>
            </Select.Content>
        </Select>
    );
};
