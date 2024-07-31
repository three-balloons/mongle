import { cn } from '@/util/cn';
import style from '@/components/explorer/explorer.module.css';
import { BubbleToggleList } from '@/components/explorer/bubbleToggleList/BubbleToggleList';
import { useBubble } from '@/objects/bubble/useBubble';

export const Explorer = () => {
    const { bubbleTree } = useBubble();

    return (
        <div className={cn(style.default)}>
            {<BubbleToggleList className={style.workSpaceName} name={bubbleTree.name} children={bubbleTree.children} />}
        </div>
    );
};
