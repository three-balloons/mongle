import ToggleList from '@/headless/toggleList/ToggleList';
import style from '@/components/explorer/bubbleToggleList/bubble-toggle-list.module.css';
import { cn } from '@/util/cn';
import arrow from '@/assets/icon/button-right.svg';

type BubbleToggleListProps = {
    name: string;
    children: Array<BubbleToggleListProps>;
};

const marginValue = 12;

export const BubbleToggleList = ({ name, children }: BubbleToggleListProps) => {
    return (
        <ToggleList className={cn(style.default)} style={{ marginLeft: `${marginValue}px` }}>
            {({ open }: { open: boolean }) => (
                <>
                    <ToggleList.Button className={cn(style.title)}>
                        <img src={arrow} className={cn(style.toggleButton, open ? style.rotated : style.idle)} />
                        <span className={cn(style.titleText)}>{name}</span>
                    </ToggleList.Button>
                    <ToggleList.Content>
                        {children.length > 0 &&
                            children.map((child, index) => {
                                if (child.children.length == 0)
                                    return (
                                        <div
                                            key={index}
                                            className={cn(style.title)}
                                            style={{ marginLeft: `${marginValue}px` }}
                                        >
                                            {child.name}
                                        </div>
                                    );
                                return <BubbleToggleList key={index} name={child.name} children={child.children} />;
                            })}
                    </ToggleList.Content>
                </>
            )}
        </ToggleList>
    );
};
