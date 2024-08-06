import { type LogContextProps, LogContext } from '@/objects/log/LogProvider';
import { useContext } from 'react';

/**
 * store bubbles and its functions
 */
export const useLog = (): LogContextProps => {
    const context = useContext(LogContext);
    if (context === undefined) {
        throw new Error('useLog must be used within a LogProvider');
    }
    return context;
};
