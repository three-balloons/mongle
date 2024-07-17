import { mockedBubbleTree, mockedWorkSpaceName } from '@/mock/tree';
import { BubbleToggleList } from '@/components/explorer/bubbleToggleList/BubbleToggleList';
import style from '@/components/explorer/bubbleTree/bubble-tree.module.css';

export const BubbleTree = () => {
    const bubbletree = mockedBubbleTree.data.paths;
    return (
        <>
            <div className={style.workSpaceName}>{mockedWorkSpaceName}</div>
            {bubbletree.map((bubble, index) => (
                <BubbleToggleList key={index} name={bubble.name} children={bubble.children} />
            ))}
        </>
    );
};
