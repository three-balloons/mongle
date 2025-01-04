import { cn } from '@/util/cn';
import style from '@/components/explorer/explorer.module.css';
import { BubbleToggleList } from '@/components/explorer/bubbleToggleList/BubbleToggleList';
import { useBubble } from '@/objects/bubble/useBubble';
import { useTutorial } from '@/components/tutorial/useTutorial';

export const Explorer = () => {
    const { bubbleTree } = useBubble();
    const { explorerRef } = useTutorial();

    return (
        <div ref={explorerRef} className={cn(style.default)}>
            {
                <BubbleToggleList
                    className={style.workSpaceName}
                    name={bubbleTree.name}
                    children={bubbleTree.children}
                    path={''}
                />
            }
        </div>
    );
};
