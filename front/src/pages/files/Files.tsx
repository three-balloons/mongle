import { getBubbleTreeAPI, getBubbleAPI } from '@/api/bubble';
import style from '@/pages/files/files.module.css';
import { FreeView } from '@/pages/files/FreeView';
import { GridView } from '@/pages/files/GridView';

export const Files = () => {
    const apiHandler = async () => {
        const bubble = await getBubbleAPI('Workspace1', '/ws1');
        const bubbleTree = await getBubbleTreeAPI('Workspace1');
        console.log('Bubble', bubble);
        console.log('Bubble tree', bubbleTree);
    };
    return (
        <div className={style.default}>
            <GridView />
            {/* <FreeView /> */}
            <button onClick={apiHandler}>API 호출</button>
        </div>
    );
};
