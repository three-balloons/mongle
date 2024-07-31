import style from '@/components/select/toolSelect/eraser-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';
import { ReactComponent as EraserIcon } from '@/assets/icon/eraser.svg';
import { useBubble } from '@/objects/bubble/useBubble';
import { useCurve } from '@/objects/curve/useCurve';
import Modal from '@/headless/modal/Modal';
import { useRenderer } from '@/objects/renderer/useRenderer';

export const EraserModal = () => {
    const { eraseConfig, setEraseMode } = useConfigStore((state) => state);
    const { clearAllBubbles } = useBubble();
    const { clearAllCurves } = useCurve();
    const { reRender } = useRenderer();

    return (
        <Modal className={style.default}>
            <Modal.Opener>
                <EraserIcon className={style.icon} />
            </Modal.Opener>
            <Modal.Overlay zIndex={1} />
            <Modal.Content className={style.content}>
                <div className={style.title}>지우개 선택</div>
                <div className={style.option}>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="영역"
                            className={style.radio}
                            checked={eraseConfig.mode == 'area'}
                            onChange={() => setEraseMode('area')}
                        />
                        <span className={style.radioText}>영역 지우개 선택</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="획"
                            className={style.radio}
                            checked={eraseConfig.mode == 'stroke'}
                            onChange={() => setEraseMode('stroke')}
                        />
                        <span className={style.radioText}>획 지우개 선택</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="option"
                            value="버블"
                            className={style.radio}
                            checked={eraseConfig.mode == 'bubble'}
                            onChange={() => setEraseMode('bubble')}
                        />
                        <span className={style.radioText}>버블 지우개 선택</span>
                    </label>
                </div>
                <Modal.Closer
                    className={cn(style.clear)}
                    onClick={() => {
                        clearAllBubbles();
                        clearAllCurves();
                        reRender();
                    }}
                >
                    모두 지우기
                </Modal.Closer>
            </Modal.Content>
        </Modal>
    );
};
