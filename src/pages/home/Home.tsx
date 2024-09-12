import style from '@/pages/home/home.module.css';
import { GridView } from '@/pages/home/GridView';
import { AppNavBar, type SelectedPageOption } from '@/components/appNavBar/AppNavBar';
import { useState } from 'react';
import { Setting } from '@/pages/home/setting/Setting';
import { Profile } from '@/pages/home/profile/Profile';
import { Trash } from '@/pages/home/trash/Trash';

export const Home = () => {
    const [showPage, setShowPage] = useState<SelectedPageOption>('workspace');
    return (
        <div className={style.default}>
            <AppNavBar
                selectedOption={showPage}
                selectedHandler={(option: SelectedPageOption) => setShowPage(option)}
            />
            <div className={style.view}>
                {showPage == 'workspace' && <GridView />}
                {showPage == 'profile' && <Profile />}
                {showPage == 'setting' && <Setting />}
                {showPage == 'trash' && <Trash />}
            </div>
        </div>
    );
};
