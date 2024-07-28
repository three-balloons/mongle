import { WorkspaceSettingModal } from '@/components/workspaceSettingModal/WorkspaceSettingModal';
import { files } from '@/mock/files';
import style from '@/pages/files/grid-view.module.css';
import objectStyle from '@/style/common/object.module.css';
import { cn } from '@/util/cn';
import { getThemeStyle } from '@/util/getThemeStyle';
import { useNavigate } from 'react-router-dom';

export const GridView = () => {
    const navigate = useNavigate();
    const fileList = files;
    return (
        <div className={style.fileContainer}>
            {fileList.map((file, index) => {
                return (
                    <div key={index} className={style.fileWrapper}>
                        <div
                            className={cn(objectStyle.bubble, getThemeStyle(file.theme), style.bubble)}
                            style={{ animationDelay: `${Math.random()}s` }}
                            onClick={() => navigate(`/workspace/${file.id}`)}
                        ></div>
                        <WorkspaceSettingModal className={style.fileName} workSpaceName={file.name} />
                    </div>
                );
            })}
        </div>
    );
};
