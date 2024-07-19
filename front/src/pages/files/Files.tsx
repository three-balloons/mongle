import { WorkspaceSettingModal } from '@/components/workspaceSettingModal/WorkspaceSettingModal';
import { files } from '@/mock/files';
import style from '@/pages/files/files.module.css';
import { useNavigate } from 'react-router-dom';

export const Files = () => {
    const navigate = useNavigate();
    const fileList = files;

    return (
        <div className={style.default}>
            <div className={style.fileContainer}>
                {fileList.map((file, index) => {
                    return (
                        <div key={index} className={style.fileWrapper}>
                            <div className={style.circle} onClick={() => navigate(`/workspace/${file.id}`)}></div>
                            <WorkspaceSettingModal className={style.fileName} workSpaceName={file.name} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
