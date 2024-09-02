import ToggleList from '@/headless/toggleList/ToggleList';
import style from '@/components/explorer/bubbleToggleList/bubble-toggle-list.module.css';
import { cn } from '@/util/cn';
import { ReactComponent as ArrowIcon } from '@/assets/icon/button-right.svg';
import { useRenderer } from '@/objects/renderer/useRenderer';
import { useConfigStore } from '@/store/configStore';
import { useCamera } from '@/objects/camera/useCamera';
import { useLog } from '@/objects/log/useLog';
import { useBubble } from '@/objects/bubble/useBubble';
import { useEffect, useRef, useState } from 'react';

type BubbleToggleListProps = {
    name: string;
    path: string;
    children: Array<BubbleTreeNode>;
    className?: string;
};

export const BubbleToggleList = ({ name, children, path, className }: BubbleToggleListProps) => {
    const { getCameraView } = useRenderer();
    const { zoomBubble, updateCameraView } = useCamera();
    const { setFocusBubblePath } = useBubble();
    const { pushLog } = useLog();
    const { mode } = useConfigStore((state) => state);
    const zoomAtBubble = (bubblePath: string) => {
        if (mode == 'animate') return;
        const originView = { ...getCameraView() };
        if (bubblePath == '') {
            setFocusBubblePath(undefined);
            const { y: height, x: width } = getCameraView().size;
            const newView = {
                pos: {
                    top: -height / 2,
                    left: -width / 2,
                    width: width,
                    height: height,
                },
                size: {
                    x: width,
                    y: height,
                },
                path: '/',
            };
            updateCameraView(newView, originView);
            pushLog([{ type: 'move', object: originView, options: { newCameraView: newView } }]);
            return;
        }
        setFocusBubblePath(bubblePath);
        const newView = zoomBubble(bubblePath);
        if (newView) pushLog([{ type: 'move', object: originView, options: { newCameraView: newView } }]);
    };
    type EditNamePrams = {
        isEdit: Array<boolean>;
        title: Array<string>;
        buttonRef: React.MutableRefObject<null[] | HTMLDivElement[]>;
    };
    const [editStates, setEditStates] = useState<EditNamePrams>({
        isEdit: [false, ...children.map(() => false)],
        title: [name, ...children.map((child) => child.name)],
        buttonRef: useRef<null[] | HTMLDivElement[]>([null, ...children.map(() => null)]),
    });

    useEffect(() => {
        setEditStates((prev) => {
            return {
                isEdit: [false, ...children.map(() => false)],
                title: [name, ...children.map((child) => child.name)],
                buttonRef: prev.buttonRef,
            };
        });
        editStates.buttonRef.current = [null, ...children.map(() => null)];
    }, [children]);

    useEffect(() => {
        const editStateLength = editStates.isEdit.length;
        for (let i = 0; i < editStateLength; i++) {
            if (editStates.isEdit[i] && editStates.buttonRef.current && editStates.buttonRef.current[i]) {
                editStates.buttonRef.current[i]?.focus({ preventScroll: true });
            }
        }
    }, [editStates]);

    const handleDoubleClick = (index: number) => {
        setEditStates((prevStates) => {
            const newIsEdit = [...prevStates.isEdit];
            newIsEdit[index] = true;
            return {
                ...prevStates,
                isEdit: newIsEdit,
            };
        });
    };

    const handleChange = (index: number, title: string) => {
        setEditStates((prevStates) => {
            const newTitle = [...prevStates.title];
            newTitle[index] = title;
            return {
                ...prevStates,
                title: newTitle,
            };
        });
    };

    const handleBlur = (index: number) => {
        setEditStates((prevStates) => {
            const newIsEdit = [...prevStates.isEdit];
            newIsEdit[index] = false;

            return {
                ...prevStates,
                isEdit: newIsEdit,
            };
        });
    };

    return (
        <ToggleList className={cn(style.default, className)}>
            {({ open }: { open: boolean }) => (
                <>
                    <ToggleList.Button className={cn(style.title)}>
                        <ArrowIcon className={cn(style.toggleButton, open ? style.rotated : style.idle)} />
                        {editStates.isEdit[0] ? (
                            <input
                                className={cn(style.titleTextButton)}
                                value={editStates.title[0]}
                                ref={(element) => {
                                    editStates.buttonRef.current[0] = element;
                                }}
                                onBlur={() => handleBlur(0)}
                                onChange={(e) => {
                                    handleChange(0, e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleBlur(0);
                                        e.currentTarget.blur();
                                    }
                                }}
                            ></input>
                        ) : (
                            <span
                                className={cn(style.titleText)}
                                onClick={() => zoomAtBubble(path)}
                                onDoubleClick={() => handleDoubleClick(0)}
                            >
                                {editStates.title[0]}
                            </span>
                        )}
                    </ToggleList.Button>
                    <ToggleList.Content>
                        {children.length > 0 &&
                            children.map((child, index) => {
                                if (child.children.length == 0)
                                    return (
                                        <div key={index + 1}>
                                            {editStates.isEdit[index + 1] ? (
                                                <input
                                                    className={cn(style.titleTextButton, style.marginLeft24)}
                                                    value={editStates.title[index + 1]}
                                                    ref={(element) => {
                                                        editStates.buttonRef.current[index + 1] = element;
                                                    }}
                                                    onChange={(e) => {
                                                        handleChange(index + 1, e.target.value);
                                                    }}
                                                    onBlur={() => handleBlur(index + 1)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleBlur(index + 1);
                                                            e.currentTarget.blur();
                                                        }
                                                    }}
                                                ></input>
                                            ) : (
                                                <span
                                                    className={cn(style.title, style.marginLeft24)}
                                                    onClick={() => zoomAtBubble(path + '/' + child.name)}
                                                    onDoubleClick={() => handleDoubleClick(index + 1)}
                                                >
                                                    {editStates.title[index + 1]}
                                                </span>
                                            )}
                                        </div>
                                    );
                                return (
                                    <BubbleToggleList
                                        key={index}
                                        name={child.name}
                                        children={child.children}
                                        path={path + '/' + child.name}
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
