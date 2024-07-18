import { cn } from '@/util/cn';
import style from '@/pages/layout/main-layout.module.css';
import { Menu } from '@/components/menu/Menu';
import { Workspace } from '@/components/workspace/Workspace';
import { Explorer } from '@/components/explorer/Explorer';
import { useState } from 'react';
import { CurveProvider } from '@/objects/CurveProvider';

export const MainLayout = () => {
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth - 150, height: window.innerHeight - 100 });
    const [isShowExplorer, setIsShowExplorer] = useState(true);
    // 캔버스 크기는 js로 관리, 캔버스가 화면 밖으로 넘어가지 않음을 보장해야 함

    const WorkspaceResizeHandler = () => {
        if (isShowExplorer) {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight - 100 });
            setIsShowExplorer(false);
        } else {
            setCanvasSize({ width: window.innerWidth - 150, height: window.innerHeight - 100 });
            setIsShowExplorer(true);
        }
    };
    return (
        <div className={cn(style.default)}>
            <CurveProvider sensitivity={2}>
                <Menu workSpaceResizeHandler={WorkspaceResizeHandler} />
                <div className={cn(style.workspace)}>
                    {isShowExplorer && <Explorer />}
                    <Workspace width={canvasSize.width} height={canvasSize.height} />
                </div>
            </CurveProvider>
        </div>
    );
};
