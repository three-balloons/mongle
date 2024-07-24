import Select from '@/headless/select/Select';
import style from '@/components/select/controlSelect/control-select.module.css';
import { cn } from '@/util/cn';
import shrink from '@/assets/icon/shrink.svg';
import enlarge from '@/assets/icon/enlarge.svg';

import { useViewStore } from '@/store/viewStore';

const Icon = ({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img className={cn(className)} src={src} alt={alt} {...props}></img>;
};

export const ControlSelect = () => {
    const { cameraView, setCameraView } = useViewStore((state) => state);
    // TODO: 투터치 인터페이스 구현(줌/아웃 가능)
    const resizeView = (intensity: number) => {
        setCameraView({
            ...cameraView,
            pos: {
                left: cameraView.pos.left + (cameraView.pos.width * intensity) / 200,
                top: cameraView.pos.top + (cameraView.pos.height * intensity) / 200,
                width: (cameraView.pos.width * (100 - intensity)) / 100,
                height: (cameraView.pos.height * (100 - intensity)) / 100,
            },
        });
    };

    return (
        <Select className={style.default} initialOpen disableClose>
            <Select.Content className={style.content}>
                <div className={style.resize}>
                    <Select.Option
                        className={cn(style.option, style.large)}
                        value={<Icon src={shrink} className={style.large} />}
                        onSelect={() => {
                            resizeView(-20);
                        }}
                    >
                        <Icon src={shrink} className={style.large} />
                    </Select.Option>
                    <Select.Option
                        className={cn(style.option, style.large)}
                        value={<Icon src={enlarge} className={style.large} />}
                        onSelect={() => {
                            resizeView(20);
                        }}
                    >
                        <Icon src={enlarge} className={style.large} />
                    </Select.Option>
                </div>
            </Select.Content>
        </Select>
    );
};
