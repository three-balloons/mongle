import React, { createContext, useContext, useState, useCallback } from 'react';

type ModalContextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
    children: React.ReactNode;
    initialIsOpen: boolean;
}

const ModalProvider = ({ children, initialIsOpen }: ModalProviderProps) => {
    const [isOpen, setIsOpen] = useState(initialIsOpen);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return <ModalContext.Provider value={{ isOpen, open, close }}>{children}</ModalContext.Provider>;
};

const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export { ModalProvider, useModal };
