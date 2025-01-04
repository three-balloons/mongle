import { TutorialContext } from '@/components/tutorial/TutorialProvider';
import { useContext } from 'react';

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};
