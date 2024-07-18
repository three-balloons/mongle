import { cn } from '@/util/cn';
import style from '@/components/explorer/explorer.module.css';
import { mockedBubbleTree, mockedWorkSpaceName } from '@/mock/tree';
import { BubbleToggleList } from '@/components/explorer/bubbleToggleList/BubbleToggleList';

export const Explorer = () => {
    const bubbletree = mockedBubbleTree.data.paths;
    return (
        <div className={cn(style.default)}>
            <div className={style.workSpaceName}>{mockedWorkSpaceName}</div>
            {bubbletree.map((bubble, index) => (
                <BubbleToggleList key={index} name={bubble.name} children={bubble.children} />
            ))}
        </div>
    );
};
