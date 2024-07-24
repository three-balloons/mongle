import { useState } from 'react';
import { cn } from '@/util/cn';
import style from '@/pages/workspace/workspace.module.css';
import { Menu } from '@/components/menu/Menu';
import { Canvas } from '@/components/canvas/Canvas';
import { Explorer } from '@/components/explorer/Explorer';
import { CurveProvider } from '@/objects/curve/CurveProvider';
import { files } from '@/mock/files';
import { getThemeStyle } from '@/util/getThemeStyle';
import { BubbleProvider } from '@/objects/bubble/BubbleProvider';
import { RendererProvider } from '@/objects/renderer/RendererProvider';

type WorkspaceProps = {
    workspaceID: string;
};
export const Workspace = ({ workspaceID }: WorkspaceProps) => {
    // TODO API로 대체
    const theme = files.find((file) => {
        return file.id == workspaceID;
    })?.theme;
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
        <div className={cn(style.default, getThemeStyle(theme))}>
            <BubbleProvider>
                <CurveProvider sensitivity={2}>
                    <RendererProvider width={canvasSize.width} height={canvasSize.height}>
                        <Menu workSpaceResizeHandler={WorkspaceResizeHandler} />
                        <div className={cn(style.workspace)}>
                            {isShowExplorer && <Explorer />}
                            <Canvas width={canvasSize.width} height={canvasSize.height} />
                        </div>
                    </RendererProvider>
                </CurveProvider>
            </BubbleProvider>
        </div>
    );
};
