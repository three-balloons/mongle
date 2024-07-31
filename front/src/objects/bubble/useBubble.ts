import { type BubbleContextProps, BubbleContext } from '@/objects/bubble/BubbleProvider';
import { useContext } from 'react';

/**
 * store bubbles and its functions
 */
export const useBubble = (): BubbleContextProps => {
    const context = useContext(BubbleContext);
    if (context === undefined) {
        throw new Error('useBubble must be used within a BubbleProvider');
    }
    return context;
};
