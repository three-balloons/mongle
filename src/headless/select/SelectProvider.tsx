import React, { createContext, useContext, useState, useCallback } from 'react';

type SelectContextType = {
    selectedValue: React.ReactNode;
    isOpen: boolean;
    toggleOpen: () => void;
    selectOption: (value: React.ReactNode, onSelectHandler?: () => void) => void;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProviderProps {
    children: React.ReactNode;
    initialIsOpen: boolean;
    disableClose: boolean;
}

const SelectProvider = ({ children, initialIsOpen, disableClose }: SelectProviderProps) => {
    const [selectedValue, setSelectedValue] = useState<React.ReactNode>();
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
    const closeSelect = useCallback(() => setIsOpen(false), []);
    const selectOption = useCallback(
        (value: React.ReactNode, onSelectHandler?: () => void) => {
            setSelectedValue(value);
            if (!disableClose) closeSelect();
            if (onSelectHandler) onSelectHandler();
        },
        [closeSelect],
    );

    return (
        <SelectContext.Provider value={{ selectedValue, isOpen, toggleOpen, selectOption }}>
            {children}
        </SelectContext.Provider>
    );
};

const useSelect = () => {
    const context = useContext(SelectContext);
    if (!context) {
        throw new Error('useSelect must be used within a SelectProvider');
    }
    return context;
};

export { SelectProvider, useSelect };
