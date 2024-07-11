import { cn } from '@/util/cn';
import style from '@/pages/layout/main-layout.module.css';
import { Menu } from '@/components/menu/Menu';
import { Workspace } from '@/components/workspace/Workspace';
import { Explorer } from '@/components/explorer/Explorer';
import { useState } from 'react';
import { CurveProvider } from '@/objects/CurveProvider';

export const MainLayout = () => {
    const [canvasSize] = useState({ width: window.innerWidth - 100, height: window.innerHeight - 100 });
    // 캔버스 크기는 js로 관리, 캔버스가 화면 밖으로 넘어가지 않음을 보장해야 함
    return (
        <div className={cn(style.default)}>
            <CurveProvider sensitivity={1}>
                <Menu />
                <div className={cn(style.workspace)}>
                    <Explorer />
                    <Workspace width={canvasSize.width} height={canvasSize.height} />
                </div>
            </CurveProvider>
        </div>
    );
};
