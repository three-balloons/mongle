import style from '@/pages/files/files.module.css';
// import { FreeView } from '@/pages/files/FreeView';
import { GridView } from '@/pages/files/GridView';

export const Files = () => {
    return (
        <div className={style.default}>
            <GridView />
            {/* <FreeView /> */}
        </div>
    );
};
