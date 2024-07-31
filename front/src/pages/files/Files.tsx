import { _getBubbleTree, getBubble } from '@/api/bubble';
import style from '@/pages/files/files.module.css';
import { FreeView } from '@/pages/files/FreeView';
import { GridView } from '@/pages/files/GridView';

export const Files = () => {
    const apiHandler = async () => {
        const bubble = await getBubble('Workspace1', '/ws1');
        const bubbleTree = await _getBubbleTree('Workspace1');
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
