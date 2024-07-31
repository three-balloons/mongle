import ToggleList from '@/headless/toggleList/ToggleList';
import style from '@/components/explorer/bubbleToggleList/bubble-toggle-list.module.css';
import { cn } from '@/util/cn';
import { ReactComponent as ArrowIcon } from '@/assets/icon/button-right.svg';

type BubbleToggleListProps = {
    name: string;
    children: Array<BubbleToggleListProps>;
    className?: string;
};

export const BubbleToggleList = ({ name, children, className }: BubbleToggleListProps) => {
    return (
        <ToggleList className={cn(style.default, className)}>
            {({ open }: { open: boolean }) => (
                <>
                    <ToggleList.Button className={cn(style.title)}>
                        <ArrowIcon className={cn(style.toggleButton, open ? style.rotated : style.idle)} />
                        <span className={cn(style.titleText)}>{name}</span>
                    </ToggleList.Button>
                    <ToggleList.Content>
                        {children.length > 0 &&
                            children.map((child, index) => {
                                if (child.children.length == 0)
                                    return (
                                        <div key={index} className={cn(style.title, style.marginLeft16)}>
                                            {child.name}
                                        </div>
                                    );
                                return (
                                    <BubbleToggleList
                                        key={index}
                                        name={child.name}
                                        children={child.children}
                                        className={style.marginLeft}
                                    />
                                );
                            })}
                    </ToggleList.Content>
                </>
            )}
        </ToggleList>
    );
};
