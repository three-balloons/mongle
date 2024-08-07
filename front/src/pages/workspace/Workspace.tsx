import { useState } from 'react';
import { cn } from '@/util/cn';
import style from '@/pages/workspace/workspace.module.css';
import { Menu } from '@/components/menu/Menu';
import { Canvas } from '@/components/canvas/Canvas';
import { Explorer } from '@/components/explorer/Explorer';
import { CurveProvider } from '@/objects/curve/CurveProvider';
import { getThemeStyle } from '@/util/getThemeStyle';
import { BubbleProvider } from '@/objects/bubble/BubbleProvider';
import { RendererProvider } from '@/objects/renderer/RendererProvider';
import { LogProvider } from '@/objects/log/LogProvider';
import { CameraProvider } from '@/objects/camera/CameraProvider';
import { useQuery } from '@tanstack/react-query';
import { getWorkspaceAPI } from '@/api/workspace';
// import { getBubbleAPI } from '@/api/bubble';

type WorkspaceProps = {
    workspaceID: string;
    workspaceName: string;
};
export const Workspace = ({ workspaceID, workspaceName }: WorkspaceProps) => {
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth - 150, height: window.innerHeight - 100 });
    const [isShowExplorer, setIsShowExplorer] = useState(true);
    // 캔버스 크기는 js로 관리, 캔버스가 화면 밖으로 넘어가지 않음을 보장해야 함

    const workspaceQuery = useQuery({
        queryKey: ['workspace'],
        queryFn: () => {
            return getWorkspaceAPI(workspaceID);
        },
    });

    const WorkspaceResizeHandler = () => {
        if (isShowExplorer) {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight - 100 });
            setIsShowExplorer(false);
        } else {
            setCanvasSize({ width: window.innerWidth - 150, height: window.innerHeight - 100 });
            setIsShowExplorer(true);
        }
    };

    if (workspaceQuery.isPending || workspaceQuery.isLoading) return <>로딩중...</>;
    if (workspaceQuery.isError) return <>에러입니다 ㅠ.ㅠ</>;
    const workspace = workspaceQuery.data;

    return (
        <div className={cn(style.default, getThemeStyle(workspace.theme))}>
            <BubbleProvider workspaceName={workspaceName}>
                <CurveProvider sensitivity={2}>
                    <LogProvider>
                        <CameraProvider width={canvasSize.width} height={canvasSize.height}>
                            <RendererProvider theme={workspace.theme}>
                                <Menu workSpaceResizeHandler={WorkspaceResizeHandler} />
                                <div className={cn(style.workspace)}>
                                    {isShowExplorer && <Explorer />}
                                    <Canvas
                                        width={canvasSize.width}
                                        height={canvasSize.height}
                                        workspaceId={workspaceID}
                                    />
                                </div>
                            </RendererProvider>
                        </CameraProvider>
                    </LogProvider>
                </CurveProvider>
            </BubbleProvider>
        </div>
    );
};
