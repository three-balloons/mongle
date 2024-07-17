import { cn } from '@/util/cn';
import style from '@/components/explorer/explorer.module.css';
import { BubbleTree } from '@/components/explorer/bubbleTree/BubbleTree';

export const Explorer = () => {
    return (
        <div className={cn(style.default)}>
            <BubbleTree />
        </div>
    );
};
