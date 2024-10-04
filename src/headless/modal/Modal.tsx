import React from 'react';
import { ModalProvider, useModal } from '@/headless/modal/ModalProvider';
import { cn } from '@/util/cn';

type ModalProps = {
    children: React.ReactNode;
    className?: string;
    initialOpen?: boolean;
    disableClose?: boolean;
};

const Modal = ({ children, className, initialOpen = undefined, disableClose = undefined }: ModalProps) => {
    return (
        <ModalProvider
            initialIsOpen={initialOpen === undefined ? false : true}
            disableClose={disableClose === undefined ? false : true}
        >
            <div className={cn(className)}>{children}</div>
        </ModalProvider>
    );
};

type ModalOpenerProps = {
    className?: string;
    children?: React.ReactNode;
};
const ModalOpener = ({ className, children }: ModalOpenerProps) => {
    const { open } = useModal();
    return (
        <div className={cn(className)} onClick={open}>
            {children}
        </div>
    );
};

type ModalCloserProps = {
    className?: string;
    children?: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
};
const ModalCloser = ({ className, children, onClick }: ModalCloserProps) => {
    const { close } = useModal();
    return (
        <div
            className={cn(className)}
            onClick={(e) => {
                if (onClick) onClick(e);
                close();
            }}
        >
            {children}
        </div>
    );
};

type ModalOverlayProps = {
    className?: string;
    zIndex?: number;
    onClick?: () => void;
};
const ModalOverlay = ({ className, onClick, zIndex = 1 }: ModalOverlayProps) => {
    const { isOpen, isDisableClose, close } = useModal();
    return (
        <>
            {isOpen && (
                <div
                    style={{ position: 'absolute', inset: 0, cursor: 'default', zIndex: zIndex }}
                    className={cn(className)}
                    onClick={() => {
                        if (!isDisableClose) {
                            close();
                            onClick && onClick();
                        }
                    }}
                />
            )}
        </>
    );
};

type ModalContentProps = {
    children: React.ReactNode;
    className?: string;
};

const ModalContent = ({ children, className }: ModalContentProps) => {
    const { isOpen } = useModal();
    if (!isOpen) return null;
    return <div className={cn(className)}>{children}</div>;
};

Modal.Opener = ModalOpener;
Modal.Closer = ModalCloser;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;

export default Modal;
