import Select from '@/headless/select/Select';
import style from '@/components/select/toolSelect/tool-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';
import pen from '@/assets/icon/pen.svg';
import hand from '@/assets/icon/hand.svg';
import eraser from '@/assets/icon/eraser.svg';
import bubbleGun from '@/assets/icon/bubble-gun.svg';

const Icon = ({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img className={cn(className)} src={src} alt={alt} {...props}></img>;
};

export const ToolSelect = () => {
    const { setMode, mode } = useConfigStore((state) => state);
    return (
        <Select className={style.default} initialOpen disableClose>
            <Select.Content className={style.content}>
                <Select.Option
                    className={cn(style.option, mode === 'move' && style.activeOption)}
                    value={<Icon src={hand} className={style.icon} />}
                    onSelect={() => {
                        setMode('move');
                    }}
                >
                    <Icon src={hand} className={style.icon} />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'draw' && style.activeOption)}
                    value={<Icon src={pen} className={style.icon} />}
                    onSelect={() => {
                        setMode('draw');
                    }}
                >
                    <Icon src={pen} className={style.icon} />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'erase' && style.activeOption)}
                    value={<Icon src={eraser} />}
                    onSelect={() => {
                        setMode('erase');
                    }}
                >
                    <Icon src={eraser} className={style.icon} />
                </Select.Option>
                <Select.Option
                    className={cn(style.option, mode === 'bubble' && style.activeOption)}
                    value={<Icon src={bubbleGun} className={style.icon} />}
                    onSelect={() => {
                        setMode('bubble');
                    }}
                >
                    <Icon src={bubbleGun} className={style.icon} />
                </Select.Option>
            </Select.Content>
        </Select>
    );
};
