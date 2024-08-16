import Select from '@/headless/select/Select';
import style from '@/components/select/weightSelect/radius-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';

const RadiusOption = ({ radius, className }: { radius: number; className?: string }) => {
    return (
        <div className={cn(style.circleWrapper)}>
            <div className={cn(style.circle, className)} style={{ height: `${radius}px`, width: `${radius}px` }}></div>
        </div>
    );
};

export const RadiusSelect = () => {
    const { setEraseRadius, eraseConfig } = useConfigStore((state) => state);

    return (
        <Select className={style.default}>
            <Select.Overlay zIndex={1} />
            <Select.Trigger className={style.option}>
                <RadiusOption className={style.preview} radius={eraseConfig.radius} />
            </Select.Trigger>
            <Select.Content className={style.content}>
                <p className={style.title}>크기 설정</p>
                <div className={style.optionWrapper}>
                    <Select.Option
                        className={style.option}
                        value={<RadiusOption radius={10} />}
                        onSelect={() => {
                            setEraseRadius(8);
                        }}
                    >
                        <RadiusOption radius={10} />
                    </Select.Option>
                    <Select.Option
                        className={style.option}
                        value={<RadiusOption radius={20} />}
                        onSelect={() => {
                            setEraseRadius(16);
                        }}
                    >
                        <RadiusOption radius={20} />
                    </Select.Option>
                    <Select.Option
                        className={style.option}
                        value={<RadiusOption radius={30} />}
                        onSelect={() => {
                            setEraseRadius(26);
                        }}
                    >
                        <RadiusOption radius={30} />
                    </Select.Option>
                </div>
            </Select.Content>
        </Select>
    );
};
