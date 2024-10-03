import { getDeletedWorkspaceAPI } from '@/api/workspace';
import style from '@/pages/home/trash/trash.module.css';
import objectStyle from '@/style/common/object.module.css';
import { cn } from '@/util/cn';
import { differenceInDays } from '@/util/differenceInDays';
import { getThemeStyle } from '@/util/getThemeStyle';
import { useQuery } from '@tanstack/react-query';

export const Trash = () => {
    getDeletedWorkspaceAPI;
    const deletedWorkspacesQuery = useQuery({
        queryKey: ['workspaces', 'deleted'],
        queryFn: () => {
            return getDeletedWorkspaceAPI();
        },
    });

    const restoreHandler = () => {
        alert('복구 API 준비중');
    };

    if (deletedWorkspacesQuery.isLoading || deletedWorkspacesQuery.isPending) return <>로딩중</>;
    if (deletedWorkspacesQuery.isError) return <>에러입니다 ㅠ.ㅠ</>;
    const trashList = deletedWorkspacesQuery.data ?? [];
    console.log('trash', trashList);
    if (trashList.length == 0)
        return (
            <div className={style.defaultEmpty}>
                <div className={style.empty}>버린 작업 공간이 없습니다</div>
                <div className={style.descriptionEmpty}>
                    삭제한 작업 공간은 휴지통에 보관되며 10일 후 완전히 삭제됩니다
                </div>
            </div>
        );
    return (
        <div className={style.default}>
            <h1>휴지통</h1>
            <div className={style.trashs}>
                {trashList.map((workspace, index) => {
                    return (
                        <div key={index} className={style.workspaceWrapper}>
                            <div className={style.deleteDate}>
                                {15 - differenceInDays(new Date(workspace.delete_date))}일 남음
                            </div>
                            <div className={cn(objectStyle.bubble, getThemeStyle(workspace.theme))}></div>
                            <div className={style.workspaceName}>{workspace.name}</div>
                            <div className={style.restoration} onClick={restoreHandler}>
                                복구하기
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
