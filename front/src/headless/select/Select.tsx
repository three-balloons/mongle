import React from 'react';
import { SelectProvider, useSelect } from '@/headless/select/SelectProvider';
import { cn } from '@/util/cn';

type SelectProps = {
    children: React.ReactNode;
    className?: string;
};

const Select = ({ children, className }: SelectProps) => {
    return (
        <SelectProvider>
            <div className={cn(className)}>{children}</div>
        </SelectProvider>
    );
};

type SelectTriggerProps = {
    children: React.ReactNode;
    className?: string;
};

const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
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

const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
    const { isOpen } = useSelect();
    if (!isOpen) return null;
    return <div className={cn(className)}>{children}</div>;
};

type SelectOptionProps = {
    value: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    onSelect?: () => void;
};

const SelectOption: React.FC<SelectOptionProps> = ({ value, children, className, onSelect }) => {
    const { selectOption } = useSelect();

    return (
        <div className={cn(className)} onClick={() => selectOption(value, onSelect)}>
            {children}
        </div>
    );
};

Select.Content = SelectContent;
Select.Trigger = SelectTrigger;
Select.Option = SelectOption;

export default Select;
