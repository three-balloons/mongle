import style from '@/pages/home/trash/trash.module.css';

export const Trash = () => {
    const trashList = [];
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
                <div className={style.trash}>이용약관</div>
            </div>
        </div>
    );
};
