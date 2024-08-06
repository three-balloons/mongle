// import { getAllWorkspaceAPI } from '@/api/workspace';

import { WorkspaceSettingModal } from '@/components/workspaceSettingModal/WorkspaceSettingModal';
import { files } from '@/mock/files';
import style from '@/pages/home/grid-view.module.css';
import objectStyle from '@/style/common/object.module.css';
import { cn } from '@/util/cn';
import { getThemeStyle } from '@/util/getThemeStyle';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const GridView = () => {
    const navigate = useNavigate();
    const workspacesQuery = useQuery({
        queryKey: ['workspaces'],
        queryFn: () => {
            return files;
            // return getAllWorkspaceAPI();
        },
    });

    if (workspacesQuery.isLoading) return <></>;
    const workspaces: Array<Workspace> = workspacesQuery.data ?? [];
    return (
        <div className={style.default}>
            <h1>작업 공간</h1>
            <div className={style.workspaceContainer}>
                {workspaces.map((workspace, index) => {
                    return (
                        <div key={index} className={style.workspaceWrapper}>
                            <div
                                className={cn(objectStyle.bubble, getThemeStyle(workspace.theme), style.bubble)}
                                style={{ animationDelay: `${Math.random()}s` }}
                                onClick={() => navigate(`/workspace/${workspace.id}`)}
                            ></div>
                            <WorkspaceSettingModal className={style.workspaceName} workspace={workspace} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
