import React from 'react';
import { SelectProvider, useSelect } from '@/headless/select/SelectProvider';
import { cn } from '@/util/cn';

type SelectProps = {
    children: React.ReactNode;
    className?: string;
    initialOpen?: boolean;
    disableClose?: boolean;
};

const Select = ({ children, className, initialOpen = undefined, disableClose = undefined }: SelectProps) => {
    return (
        <SelectProvider
            initialIsOpen={initialOpen === undefined ? false : true}
            disableClose={disableClose === undefined ? false : true}
        >
            <div className={cn(className)}>{children}</div>
        </SelectProvider>
    );
};

type SelectTriggerProps = {
    children: React.ReactNode;
    className?: string;
};

const SelectTrigger = ({ children, className }: SelectTriggerProps) => {
    const { selectedValue, toggleOpen } = useSelect();

    return (
        <div className={cn(className)} onClick={toggleOpen}>
            {selectedValue || children}
        </div>
    );
};

type SelectContentProps = {
    children: React.ReactNode;
    className?: string;
};

const SelectContent = ({ children, className }: SelectContentProps) => {
    const { isOpen } = useSelect();
    if (!isOpen) return null;
    return <div className={cn(className)}>{children}</div>;
};

type SelectOptionProps = {
    value: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    onSelect?: () => void;
};

const SelectOption = ({ value, children, className, onSelect }: SelectOptionProps) => {
    const { selectOption } = useSelect();

    return (
        <div
            className={cn(className)}
            onClick={() => {
                selectOption(value, onSelect);
            }}
        >
            {children}
        </div>
    );
};

Select.Content = SelectContent;
Select.Trigger = SelectTrigger;
Select.Option = SelectOption;

export default Select;
