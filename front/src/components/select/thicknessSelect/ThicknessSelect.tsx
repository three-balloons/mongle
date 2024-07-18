import Select from '@/headless/select/Select';
import style from '@/components/select/thicknessSelect/thickness-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';

const LineOption = ({ thickness, className }: { thickness: number; className?: string }) => {
    return (
        <div className={cn(style.lineWrapper)}>
            <div className={cn(style.line, className)} style={{ height: `${thickness}px` }}></div>
        </div>
    );
};

export const ThicknessSelect = () => {
    const { setPenThickness, penConfig } = useConfigStore((state) => state);
    return (
        <Select className={style.default}>
            <Select.Overlay />
            <Select.Trigger>
                <LineOption className={style.preview} thickness={penConfig.thickness} />
            </Select.Trigger>
            <Select.Content className={style.content}>
                <p className={style.title}>굵기 설정</p>
                <div className={style.optionWrapper}>
                    <Select.Option
                        className={style.option}
                        value={<LineOption thickness={7} />}
                        onSelect={() => {
                            setPenThickness(7);
                        }}
                    >
                        <LineOption thickness={7} />
                    </Select.Option>
                    <Select.Option
                        className={style.option}
                        value={<LineOption thickness={3} />}
                        onSelect={() => {
                            setPenThickness(3);
                        }}
                    >
                        <LineOption thickness={3} />
                    </Select.Option>
                    <Select.Option
                        className={style.option}
                        value={<LineOption thickness={1} />}
                        onSelect={() => {
                            setPenThickness(1);
                        }}
                    >
                        <LineOption thickness={1} />
                    </Select.Option>
                </div>
            </Select.Content>
        </Select>
    );
};
