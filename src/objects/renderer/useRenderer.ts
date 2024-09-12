import { type RendererContextProps, RendererContext } from '@/objects/renderer/RendererProvider';
import { useContext } from 'react';

/**
 * store curves and its functions
 * usage: draw curve or remove curve
 */
export const useRenderer = (): RendererContextProps => {
    const context = useContext(RendererContext);
    if (context === undefined) {
        throw new Error('useRenderer must be used within a RendererProvider');
    }
    return context;
};
