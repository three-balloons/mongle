import Modal from '@/headless/modal/Modal';
import style from '@/components/workspaceSettingModal/workspace-setting-modal.module.css';
import colorStyle from '@/style/common/theme.module.css';
import objectStyle from '@/style/common/object.module.css';
import { cn } from '@/util/cn';
import { useState } from 'react';
import Select from '@/headless/select/Select';
import modify from '@/assets/icon/modify.svg';

type WorkspaceSettingModalProps = {
    workSpaceName: string;
    className: string;
};
export const WorkspaceSettingModal = ({ workSpaceName, className }: WorkspaceSettingModalProps) => {
    const [isNameChange, setIsNameChange] = useState(false);
    const [name, setName] = useState(workSpaceName);
    const [theme, setTheme] = useState<Theme>('하늘');

    const saveHandler = () => {
        // TODO 저장 구현하기
        return;
    };
    return (
        <Modal className={cn(className)}>
            <Modal.Opener>{name}</Modal.Opener>
            <Modal.Overlay className={style.overlay} zIndex={0} />
            <Modal.Content className={style.content}>
                {isNameChange ? (
                    <>
                        <input
                            className={(style.name, style.input)}
                            type="text"
                            value={name}
                            placeholder="이름을 입력해주세요"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button className={objectStyle.buttonSmall} onClick={() => setIsNameChange(false)}>
                            완료
                        </button>
                    </>
                ) : (
                    <>
                        <span className={style.name}>{name}</span>
                        <img className={style.iconModify} src={modify} onClick={() => setIsNameChange(true)}></img>
                    </>
                )}

                <Select initialOpen disableClose>
                    <Select.Content className={style.theme}>
                        <Select.Option
                            className={style.option}
                            value={theme}
                            onSelect={() => {
                                setTheme('하늘');
                            }}
                        >
                            <div className={cn(colorStyle.themeBlue, style.themeOption)}>
                                <div className={objectStyle.bubble}></div>
                                <div className={cn(theme == '하늘' && style.themeSelected)}>하늘</div>
                            </div>
                        </Select.Option>
                        <Select.Option
                            className={style.option}
                            value={theme}
                            onSelect={() => {
                                setTheme('분홍');
                            }}
                        >
                            <div className={cn(colorStyle.themePink, style.themeOption)}>
                                <div className={objectStyle.bubble}></div>
                                <div className={cn(theme == '분홍' && style.themeSelected)}>분홍</div>
                            </div>
                        </Select.Option>
                        <Select.Option
                            className={style.option}
                            value={theme}
                            onSelect={() => {
                                setTheme('연두');
                            }}
                        >
                            <div className={cn(colorStyle.themeGreen, style.themeOption)}>
                                <div className={objectStyle.bubble}></div>
                                <div className={cn(theme == '연두' && style.themeSelected)}>연두</div>
                            </div>
                        </Select.Option>
                        <Select.Option
                            className={style.option}
                            value={theme}
                            onSelect={() => {
                                setTheme('노랑');
                            }}
                        >
                            <div className={cn(colorStyle.themeYellow, style.themeOption)}>
                                <div className={objectStyle.bubble}></div>
                                <div className={cn(theme == '노랑' && style.themeSelected)}>노랑</div>
                            </div>
                        </Select.Option>
                        <Select.Option
                            className={style.option}
                            value={theme}
                            onSelect={() => {
                                setTheme('하양');
                            }}
                        >
                            <div className={cn(colorStyle.themeWhite, style.themeOption)}>
                                <div className={objectStyle.bubble}></div>
                                <div className={cn(theme == '하양' && style.themeSelected)}>하양</div>
                            </div>
                        </Select.Option>
                        <Select.Option
                            className={style.option}
                            value={theme}
                            onSelect={() => {
                                setTheme('검정');
                            }}
                        >
                            <div className={cn(colorStyle.themeBlack, style.themeOption)}>
                                <div className={objectStyle.bubble}></div>
                                <div className={cn(theme == '검정' && style.themeSelected)}>검정</div>
                            </div>
                        </Select.Option>
                    </Select.Content>
                </Select>
                <Modal.Closer className={style.save}>
                    <button className={objectStyle.buttonBig} onClick={saveHandler}>
                        저장하기
                    </button>
                </Modal.Closer>
            </Modal.Content>
        </Modal>
    );
};
