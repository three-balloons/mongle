import { type PictureContextProps, PictureContext } from '@/objects/picture/PictureProvider';
import { useContext } from 'react';

/**
 * store curves and its functions
 * usage: draw curve or remove curve
 */
export const usePicture = (): PictureContextProps => {
    const context = useContext(PictureContext);
    if (context === undefined) {
        throw new Error('usePicture must be used within a PictureProvider');
    }
    return context;
};
