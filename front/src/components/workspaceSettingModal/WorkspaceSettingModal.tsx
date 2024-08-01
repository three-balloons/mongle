import Modal from '@/headless/modal/Modal';
import style from '@/components/workspaceSettingModal/workspace-setting-modal.module.css';
import colorStyle from '@/style/common/theme.module.css';
import objectStyle from '@/style/common/object.module.css';
import { cn } from '@/util/cn';
import { useState } from 'react';
import Select from '@/headless/select/Select';
import { ReactComponent as ModifyIcon } from '@/assets/icon/modify.svg';
import { updateWorkspaceAPI } from '@/api/workspace';
import { files } from '@/mock/files';
import { useMutation } from '@tanstack/react-query';

type WorkspaceSettingModalProps = {
    workspace: Workspace;
    className: string;
};
export const WorkspaceSettingModal = ({ workspace, className }: WorkspaceSettingModalProps) => {
    const [isNameChange, setIsNameChange] = useState(false);
    const [name, setName] = useState(workspace.name);
    const [theme, setTheme] = useState<Theme>(workspace.theme);

    const { mutate: updateWorkspace } = useMutation({
        mutationFn: (id: string) => updateWorkspaceAPI(id),
    });
    const saveHandler = () => {
        updateWorkspace(workspace.id, {
            onSuccess: () => {
                files.forEach((file) => {
                    if (file.id == workspace.id) {
                        file.name = name;
                        file.theme = theme;
                    }
                });
            },
        });

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
                        <ModifyIcon className={style.iconModify} onClick={() => setIsNameChange(true)} />
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
