import { type CurveContextProps, CurveContext } from '@/objects/curve/CurveProvider';
import { useContext } from 'react';

/**
 * store curves and its functions
 * usage: draw curve or remove curve
 */
export const useCurve = (): CurveContextProps => {
    const context = useContext(CurveContext);
    if (context === undefined) {
        throw new Error('useCurve must be used within a CurveProvider');
    }
    return context;
};
