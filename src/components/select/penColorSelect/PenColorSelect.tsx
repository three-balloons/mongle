import Select from '@/headless/select/Select';
import style from '@/components/select/penColorSelect/pen-color-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';
import { penColors } from '@/components/select/penColorSelect/penColors';

const ColorOption = ({ color, className }: { color: Color; className?: string }) => {
    return <div className={cn(style.circle, className)} style={{ backgroundColor: color }}></div>;
};

export const PenColorSelect = () => {
    const { setPenColor, penConfig } = useConfigStore((state) => state);
    return (
        <Select className={style.default}>
            <Select.Overlay zIndex={1} />
            <Select.Trigger>
                <div
                    className={cn(style.middleCircle, style.preview)}
                    style={penConfig.color && { backgroundColor: penConfig.color }}
                ></div>
            </Select.Trigger>
            <Select.Content className={style.content}>
                <p className={style.title}>펜 색상 선택</p>
                <div className={style.optionWrapper}>
                    {penColors.map((color, index) => {
                        return (
                            <Select.Option
                                key={index}
                                className={style.option}
                                value={<ColorOption color={color} className={style.bigCircle} />}
                                onSelect={() => {
                                    setPenColor(color);
                                }}
                            >
                                <ColorOption color={color} className={style.bigCircle} />
                            </Select.Option>
                        );
                    })}
                </div>
            </Select.Content>
        </Select>
    );
};
