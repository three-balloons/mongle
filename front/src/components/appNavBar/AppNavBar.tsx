import style from '@/components/appNavBar/app-nav-bar.module.css';
import { cn } from '@/util/cn';
import { ReactComponent as MemuIcon } from '@/assets/icon/menu.svg';
import { ReactComponent as ProfileIcon } from '@/assets/icon/profile.svg';
import { ReactComponent as FolderIcon } from '@/assets/icon/folder.svg';
import { ReactComponent as TrashIcon } from '@/assets/icon/trash.svg';
import { ReactComponent as SettingIcon } from '@/assets/icon/setting.svg';
import { useState } from 'react';

export type SelectedPageOption = 'workspace' | 'profile' | 'setting' | 'trash';
type AppNavBarProps = {
    className?: string;
    selectedOption: SelectedPageOption;
    selectedHandler: (option: SelectedPageOption) => void;
};

export const AppNavBar = ({ className, selectedOption, selectedHandler }: AppNavBarProps) => {
    const [isShowDetail, setIsShowDetail] = useState(false);

    return (
        <div className={cn(className, style.default, isShowDetail ? style.showDetail : style.hiddenDetail)}>
            <div className={style.details}>
                {window.innerWidth > 520 && (
                    <>
                        <div className={style.item}>
                            <MemuIcon className={style.iconBig} onClick={() => setIsShowDetail(!isShowDetail)} />
                        </div>
                        <div className={style.line} />
                    </>
                )}
                <div
                    className={cn(
                        style.item,
                        selectedOption === 'workspace' && style.itemSelected,
                        !isShowDetail && style.itemHidden,
                    )}
                    onClick={() => selectedHandler('workspace')}
                >
                    <FolderIcon className={style.icon} />
                    {isShowDetail && (
                        <div className={cn(style.itemText, selectedOption === 'workspace' && style.itemTextSelected)}>
                            작업 공간
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        style.item,
                        selectedOption === 'profile' && style.itemSelected,
                        !isShowDetail && style.itemHidden,
                    )}
                    onClick={() => selectedHandler('profile')}
                >
                    <ProfileIcon className={style.icon} />
                    {isShowDetail && (
                        <div className={cn(style.itemText, selectedOption === 'profile' && style.itemTextSelected)}>
                            프로필
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        style.item,
                        selectedOption === 'setting' && style.itemSelected,
                        !isShowDetail && style.itemHidden,
                    )}
                    onClick={() => selectedHandler('setting')}
                >
                    <SettingIcon className={style.icon} />
                    {isShowDetail && (
                        <div className={cn(style.itemText, selectedOption === 'setting' && style.itemTextSelected)}>
                            환경 설정
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        style.item,
                        selectedOption === 'trash' && style.itemSelected,
                        !isShowDetail && style.itemHidden,
                    )}
                    onClick={() => selectedHandler('trash')}
                >
                    <TrashIcon className={style.icon} />
                    {isShowDetail && (
                        <div className={cn(style.itemText, selectedOption === 'trash' && style.itemTextSelected)}>
                            휴지통
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
