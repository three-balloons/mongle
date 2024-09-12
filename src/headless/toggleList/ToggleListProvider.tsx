import React, { createContext, useContext, useState, useCallback } from 'react';

type ToggleListContextType = {
    isOpen: boolean;
    toggleOpen: () => void;
};

const ToggleListContext = createContext<ToggleListContextType | undefined>(undefined);

interface ToggleListProviderProps {
    children: React.ReactNode;
    initialIsOpen: boolean;
}

const ToggleListProvider = ({ children, initialIsOpen }: ToggleListProviderProps) => {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

    return <ToggleListContext.Provider value={{ isOpen, toggleOpen }}>{children}</ToggleListContext.Provider>;
};

const useToggleList = () => {
    const context = useContext(ToggleListContext);
    if (!context) {
        throw new Error('useToggleList must be used within a ToggleListProvider');
    }
    return context;
};

export { ToggleListProvider, useToggleList };
