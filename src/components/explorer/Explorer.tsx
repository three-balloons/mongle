import { cn } from '@/util/cn';
import style from '@/components/explorer/explorer.module.css';
import { BubbleToggleList } from '@/components/explorer/bubbleToggleList/BubbleToggleList';
import { useTutorial } from '@/components/tutorial/useTutorial';
import { useBubbleStore } from '@/store/bubbleStore';

type ExplorerProps = {
    resizeHandler?: (e: React.MouseEvent<HTMLDivElement>) => void;
};
export const Explorer = ({ resizeHandler }: ExplorerProps) => {
    const bubbleTreeRoot = useBubbleStore((state) => state.bubbleTreeRoot);
    const { explorerRef } = useTutorial();

    return (
        <div ref={explorerRef} className={cn(style.default)}>
            {
                <BubbleToggleList
                    className={style.workSpaceName}
                    name={bubbleTreeRoot.name}
                    children={bubbleTreeRoot.children}
                    path={''}
                />
            }
            <div className={style.edge} onMouseDown={resizeHandler} />
        </div>
    );
};
