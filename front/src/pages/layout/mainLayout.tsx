import { ReactNode } from 'react';
import { cn } from '@/util/cn';
import style from '@/pages/layout/main-layout.module.css';

type MainLayoutProp = { children: ReactNode; className?: string };
export const MainLayout = ({ children, className }: MainLayoutProp) => {
    return <div className={cn(className, style.test)}>{children}</div>;
};
