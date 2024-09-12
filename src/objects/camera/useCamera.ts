import { CameraContext, CameraContextProps } from '@/objects/camera/CameraProvider';
import { useContext } from 'react';

/**
 * store curves and its functions
 * usage: draw curve or remove curve
 */
export const useCamera = (): CameraContextProps => {
    const context = useContext(CameraContext);
    if (context === undefined) {
        throw new Error('useCamera must be used within a CameraProvider');
    }
    return context;
};
