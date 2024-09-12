import Select from '@/headless/select/Select';
import style from '@/components/select/controlSelect/control-select.module.css';
import { cn } from '@/util/cn';
import { ReactComponent as ShrinkIcon } from '@/assets/icon/shrink.svg';
import { ReactComponent as EnlargeIcon } from '@/assets/icon/enlarge.svg';
import { ReactComponent as UndoIcon } from '@/assets/icon/undo.svg';
import { ReactComponent as RedoIcon } from '@/assets/icon/redo.svg';
import { useViewStore } from '@/store/viewStore';
import { useLog } from '@/objects/log/useLog';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useConfigStore } from '@/store/configStore';
import { useCamera } from '@/objects/camera/useCamera';
import { useBubble } from '@/objects/bubble/useBubble';

export const ControlSelect = () => {
    const { cameraView } = useViewStore((state) => state);
    const { mode } = useConfigStore((state) => state);
    const { isUndoAvailable, isRedoAvailable, undo, redo } = useLog();
    const { setFocusBubblePath } = useBubble();
    const { reRender } = useRenderer();
    const { updateCameraView } = useCamera();
    // TODO: 투터치 인터페이스 구현(줌/아웃 가능)
    const resizeView = (intensity: number) => {
        setFocusBubblePath(undefined);
        updateCameraView(
            {
                ...cameraView,
                pos: {
                    left: cameraView.pos.left + (cameraView.pos.width * intensity) / 200,
                    top: cameraView.pos.top + (cameraView.pos.height * intensity) / 200,
                    width: (cameraView.pos.width * (100 - intensity)) / 100,
                    height: (cameraView.pos.height * (100 - intensity)) / 100,
                },
            },
            { ...cameraView },
        );
    };

    return (
        <Select className={style.default} initialOpen disableClose>
            <Select.Content className={style.content}>
                <div className={style.resize}>
                    <Select.Option
                        className={cn(style.option, style.large)}
                        value={<ShrinkIcon className={style.large} />}
                        onSelect={() => {
                            if (mode == 'animate') return;
                            resizeView(-20);
                        }}
                    >
                        <ShrinkIcon className={style.large} />
                    </Select.Option>
                    <Select.Option
                        className={cn(style.option, style.large)}
                        value={<EnlargeIcon className={style.large} />}
                        onSelect={() => {
                            if (mode == 'animate') return;
                            resizeView(20);
                        }}
                    >
                        <EnlargeIcon className={style.large} />
                    </Select.Option>
                    <Select.Option
                        className={cn(style.option, style.large)}
                        value={<UndoIcon className={cn(style.large, !isUndoAvailable && style.disabled)}></UndoIcon>}
                        onSelect={() => {
                            if (!isUndoAvailable) return;
                            if (mode == 'animate') return;
                            undo();
                            reRender();
                        }}
                    >
                        {/* <Icon src={undoIcon} className={cn(style.large)} /> */}
                        <UndoIcon className={cn(style.large, !isUndoAvailable && style.disabled)} />
                    </Select.Option>
                    <Select.Option
                        className={cn(style.option, style.large)}
                        value={<RedoIcon className={cn(style.large, !isRedoAvailable && style.disabled)} />}
                        onSelect={() => {
                            if (!isRedoAvailable) return;
                            if (mode == 'animate') return;
                            redo();
                            reRender();
                        }}
                    >
                        <RedoIcon className={cn(style.large, !isRedoAvailable && style.disabled)} />
                    </Select.Option>
                </div>
            </Select.Content>
        </Select>
    );
};
