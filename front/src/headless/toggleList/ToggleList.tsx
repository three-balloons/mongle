import React, { CSSProperties, ReactNode } from 'react';
import { ToggleListProvider, useToggleList } from '@/headless/toggleList/ToggleListProvider';
import { cn } from '@/util/cn';
import { isFunction } from '@/util/shapes/typeGuard';

type ToggleListProps = {
    children: React.ReactNode | (({ open }: { open: boolean }) => React.ReactNode);
    className?: string;
    initialOpen?: boolean;
    style?: CSSProperties;
};

const ToggleList = ({ children, className, initialOpen = false, style }: ToggleListProps) => {
    return (
        <ToggleListProvider initialIsOpen={initialOpen}>
            <ToggleListFunctionWrapper
                children={children}
                className={className}
                initialOpen={initialOpen}
                style={style}
            />
        </ToggleListProvider>
    );
};

const ToggleListFunctionWrapper = ({ children, className, style }: ToggleListProps) => {
    const { isOpen } = useToggleList();
    return (
        <div className={cn(className)} style={style}>
            {isFunction(children)
                ? (children as ({ open }: { open: boolean }) => ReactNode)({ open: isOpen })
                : children}
        </div>
    );
};

type ToggleListButtonProps = {
    children?: React.ReactNode;
    className?: string;
};

const ToggleListButton = ({ children, className }: ToggleListButtonProps) => {
    const { toggleOpen } = useToggleList();

    return (
        <div
            className={cn(className)}
            onClick={(event) => {
                event.stopPropagation();
                toggleOpen();
            }}
        >
            {children}
        </div>
    );
};

type ToggleListContentProps = {
    children?: React.ReactNode;
    className?: string;
    onClick?: (e?: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
};
const ToggleListContent = ({ children, className, onClick }: ToggleListContentProps) => {
    const { isOpen } = useToggleList();
    if (!isOpen) return null;
    return (
        <div
            className={cn(className)}
            onClick={(e) => {
                if (onClick) onClick(e);
            }}
        >
            {children}
        </div>
    );
};

ToggleList.Content = ToggleListContent;
ToggleList.Button = ToggleListButton;

export default ToggleList;
