import style from '@/components/select/toolSelect/eraser-select.module.css';
import { useConfigStore } from '@/store/configStore';
import { cn } from '@/util/cn';
import { EraserIcon } from '@/components/select/toolSelect/ToolSelect';
import { useBubble } from '@/objects/useBubble';
import { useCurve } from '@/objects/useCurve';
// import { useCanvas } from '@/hooks/useCanvas';
import Modal from '@/headless/modal/Modal';

export const EraserModal = () => {
    const { eraseConfig, setEraseMode } = useConfigStore((state) => state);
    const { clearAllBubbles } = useBubble();
    const { clearAllCurves } = useCurve();
    // const { clearLayerRenderer, mainLayerRef } = useCanvas();

    return (
        <Modal className={style.default}>
            <Modal.Opener>
                <EraserIcon />
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
                </div>
                <Modal.Closer
                    className={cn(style.clear)}
                    onClick={() => {
                        clearAllBubbles();
                        clearAllCurves();
                        // TODO useCanvas의 canvasRef를 workspace 내에서 접근할 수 있도록 provider 패턴 적용
                        // 용도: 메뉴에서 모두 지우고 렌더링, 탐색기에서 버블 클릭시 이동후 렌더링
                        // const mainLayer = mainLayerRef.current;
                        // if (mainLayer) clearLayerRenderer(mainLayer);
                    }}
                >
                    모두 지우기
                </Modal.Closer>
            </Modal.Content>
        </Modal>
    );
};
