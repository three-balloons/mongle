import { useEffect, useState } from 'react';
import { cn } from '@/util/cn';
import style from '@/pages/workspace/workspace.module.css';
import { Menu } from '@/components/menu/Menu';
import { Canvas } from '@/components/canvas/Canvas';
import { Explorer } from '@/components/explorer/Explorer';
import { CurveProvider } from '@/objects/curve/CurveProvider';
import { getThemeStyle } from '@/util/getThemeStyle';
import { RendererProvider } from '@/objects/renderer/RendererProvider';
import { LogProvider } from '@/objects/log/LogProvider';
import { CameraProvider } from '@/objects/camera/CameraProvider';
import { useQuery } from '@tanstack/react-query';
import { getWorkspaceAPI } from '@/api/workspace';
import { ReactComponent as BackIcon } from '@/assets/icon/arrow-left.svg';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Tutorial } from '@/components/tutorial/Tutorial';
import { TutorialProvider } from '@/components/tutorial/TutorialProvider';
import { getBubbleAPI } from '@/api/bubble';
import { useBubbleStore } from '@/store/bubbleStore';
import { useLogStore } from '@/store/useLogStore';
import { useLogSender } from '@/hooks/useLogSender';

type WorkspaceProps = {
    workspaceId: string;
};
export const Workspace = ({ workspaceId }: WorkspaceProps) => {
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth - 150, height: window.innerHeight - 100 });
    const [isShowExplorer, setIsShowExplorer] = useState(true);
    const { isDemo, needTutorial } = useAuthStore();
    const setCurrentWorkspaceId = useLogStore((state) => state.setCurrentWorkspaceId);
    const addBubblesInNode = useBubbleStore((state) => state.addBubblesInNode);
    const { sendLogsToServer } = useLogSender();
    // 캔버스 크기는 js로 관리, 캔버스가 화면 밖으로 넘어가지 않음을 보장해야 함

    const navigator = useNavigate();

    const bubbleQuery = useQuery({
        queryKey: ['bubbles', workspaceId],
        queryFn: () => {
            if (workspaceId === 'demo') return [] as Array<Bubble>;
            else return getBubbleAPI(workspaceId, '/');
        },
    });

    const initBubbles: Array<Bubble> = bubbleQuery.data ?? [];

    useEffect(() => {
        setCurrentWorkspaceId(workspaceId);
    }, [workspaceId]);
    /**
     * 초기화(서버와 동기화) 코드
     */
    useEffect(() => {
        if (!bubbleQuery.data) return;
        if (bubbleQuery.isPending || bubbleQuery.isLoading) return;
        console.log('initBubbles');
        sendLogsToServer(true);
        addBubblesInNode(initBubbles);
    }, [initBubbles]);

    useEffect(() => {
        const sendCurveToServerId = setInterval(() => sendLogsToServer(), 5000);

        return () => {
            clearInterval(sendCurveToServerId);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({
                width: isShowExplorer ? window.innerWidth - 150 : window.innerWidth,
                height: window.innerHeight - 100,
            });
            console.log('canvasSize', canvasSize);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isShowExplorer]);

    const workspaceQuery = useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: () => {
            if (workspaceId !== 'demo') return getWorkspaceAPI({ workspaceId });
            else
                return {
                    id: 'demo',
                    theme: '하늘',
                    name: '데모입니다 :)',
                } as Workspace;
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
            <TutorialProvider>
                {needTutorial && <Tutorial />}
                <CurveProvider sensitivity={2}>
                    <CameraProvider width={canvasSize.width} height={canvasSize.height}>
                        <LogProvider>
                            <RendererProvider theme={workspace.theme}>
                                <div className={style.header}>
                                    <BackIcon
                                        className={style.icon}
                                        onClick={() => {
                                            if (isDemo) navigator('/login', { replace: true });
                                            else navigator('/home', { replace: true });
                                        }}
                                    ></BackIcon>
                                    <div className={style.title}>{workspace.name}</div>
                                </div>
                                <Menu workSpaceResizeHandler={WorkspaceResizeHandler} />
                                <div className={cn(style.workspace)}>
                                    {isShowExplorer && <Explorer />}
                                    <Canvas
                                        width={canvasSize.width}
                                        height={canvasSize.height}
                                        workspaceId={workspaceId}
                                    />
                                    {/* <NameInput /> */}
                                </div>
                            </RendererProvider>
                        </LogProvider>
                    </CameraProvider>
                </CurveProvider>
            </TutorialProvider>
        </div>
    );
};
