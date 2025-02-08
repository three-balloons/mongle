import { type PdfContextProps, PdfContext } from '@/objects/pdf/PdfProvider';
import { useContext } from 'react';

/**
 * store pdf and its functions
 * usage: draw pdf or remove pdf
 */
export const usePdf = (): PdfContextProps => {
    const context = useContext(PdfContext);
    if (context === undefined) {
        throw new Error('usePdf must be used within a PdfProvider');
    }
    return context;
};
