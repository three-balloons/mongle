import { createContext, useRef } from 'react';

export type PictureContextProps = {
    setCreatingPicture: (image: HTMLImageElement, offScreen: OffscreenCanvas) => void;
    getCreatingPicture: () => { image: HTMLImageElement; offScreen: OffscreenCanvas } | undefined;
};

export const PictureContext = createContext<PictureContextProps | undefined>(undefined);

type PictureProviderProps = {
    children: React.ReactNode;
};

export const PictureProvider: React.FC<PictureProviderProps> = ({ children }) => {
    const creatingPictureRef = useRef<{ image: HTMLImageElement; offScreen: OffscreenCanvas } | undefined>(undefined);
    const setCreatingPicture = (image: HTMLImageElement, offScreen: OffscreenCanvas) => {
        creatingPictureRef.current = { image: image, offScreen: offScreen };
    };

    const getCreatingPicture = () => {
        return creatingPictureRef.current;
    };

    return (
        <PictureContext.Provider
            value={{
                setCreatingPicture,
                getCreatingPicture,
            }}
        >
            {children}
        </PictureContext.Provider>
    );
};
