import React from 'react';
import { ModalProvider, useModal } from '@/headless/modal/ModalProvider';
import { cn } from '@/util/cn';

type ModalProps = {
    children: React.ReactNode;
    className?: string;
    initialOpen?: boolean;
    disableClose?: boolean;
};

const Modal = ({ children, className, initialOpen = undefined }: ModalProps) => {
    return (
        <ModalProvider initialIsOpen={initialOpen === undefined ? false : true}>
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
};
const ModalCloser = ({ className, children }: ModalCloserProps) => {
    const { close } = useModal();
    return (
        <div className={cn(className)} onClick={close}>
            {children}
        </div>
    );
};

type ModalOverlayProps = {
    className?: string;
};
const ModalOverlay = ({ className }: ModalOverlayProps) => {
    const { isOpen, close } = useModal();
    return (
        <>
            {isOpen && (
                <div
                    style={{ position: 'absolute', inset: 0, cursor: 'default' }}
                    className={cn(className)}
                    onClick={close}
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
