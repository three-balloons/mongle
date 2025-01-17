import { createContext, useRef } from 'react';

export type PictureContextProps = {
    setCreatingPicture: (image: HTMLImageElement, offScreen: OffscreenCanvas) => void;
    getCreatingPicture: () => { image: HTMLImageElement; offScreen: OffscreenCanvas } | undefined;
    setSelectedPictures: (pictures: Picture[]) => void;
    getSelectedPictures: () => Picture[];
};

export const PictureContext = createContext<PictureContextProps | undefined>(undefined);

type PictureProviderProps = {
    children: React.ReactNode;
};

export const PictureProvider: React.FC<PictureProviderProps> = ({ children }) => {
    const creatingPictureRef = useRef<{ image: HTMLImageElement; offScreen: OffscreenCanvas } | undefined>(undefined);
    const selectedPicturesRef = useRef<Picture[]>([]);
    const setCreatingPicture = (image: HTMLImageElement, offScreen: OffscreenCanvas) => {
        creatingPictureRef.current = { image: image, offScreen: offScreen };
    };

    const getCreatingPicture = () => {
        return creatingPictureRef.current;
    };

    const setSelectedPictures = (pictures: Picture[]) => {
        selectedPicturesRef.current = [...pictures];
    };

    const getSelectedPictures = () => {
        return selectedPicturesRef.current;
    };

    return (
        <PictureContext.Provider
            value={{
                setCreatingPicture,
                getCreatingPicture,
                setSelectedPictures,
                getSelectedPictures,
            }}
        >
            {children}
        </PictureContext.Provider>
    );
};
