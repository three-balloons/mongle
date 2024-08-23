import { useBubble } from '@/objects/bubble/useBubble';
import { useConfigStore } from '@/store/configStore';
import { useViewStore } from '@/store/viewStore';
import { bubble2globalWithRect, global2bubbleWithRect } from '@/util/coordSys/conversion';
import { getParentPath } from '@/util/path/path';
import { easeInCubic, easeOutCubic } from '@/util/transition/transtion';
import { createContext, useEffect, useRef } from 'react';

export type CameraContextProps = {
    setCameraView: (cameraView: ViewCoord) => void;
    getCameraView: () => ViewCoord;
    zoomBubble: (bubblePath: string) => ViewCoord | undefined;
    updateCameraView: (cameraView: ViewCoord, prevPosition?: Rect | undefined) => void;
};

export const CameraContext = createContext<CameraContextProps | undefined>(undefined);

type CameraProviderProps = {
    children: React.ReactNode;
    height?: number;
    width?: number;
};

export const CameraProvider: React.FC<CameraProviderProps> = ({ children, height = 0, width = 0 }) => {
    const { setCameraView } = useViewStore((state) => state);
    const { mode, setMode } = useConfigStore((state) => state);
    const { isShowAnimation } = useConfigStore((state) => state);
    const isShowAnimationRef = useRef<boolean>(isShowAnimation);
    const modeRef = useRef<ControlMode>('none');

    const { findBubble, descendant2child, getChildBubbles } = useBubble();

    const cameraViewRef = useRef<ViewCoord>({
        pos: {
            top: -height / 2,
            left: -width / 2,
            width: width,
            height: height,
        },
        size: {
            x: width,
            y: height,
        },
        path: '/',
    });

    useEffect(() => {
        setCameraView(cameraViewRef.current);
        // Rerenders when canvas view changes
        useViewStore.subscribe(({ cameraView }) => {
            cameraViewRef.current = cameraView;
        });
        useConfigStore.subscribe(({ isShowAnimation }) => {
            isShowAnimationRef.current = isShowAnimation;
        });
    }, []);

    // 카메라를 root로 올리고 parentBubble로 다시 내림
    const zoomBubble = (bubblePath: string) => {
        const bubble = findBubble(bubblePath);
        if (bubble == undefined) return;

        let newCameraPos = cameraViewRef.current.pos;
        let cameraPath: string | undefined = cameraViewRef.current.path;

        // const parentBubble = descendant2child(parentBubble, '/');
        let ret: Rect = { ...newCameraPos };
        while (cameraPath && cameraPath != '/') {
            const cameraBubble = findBubble(cameraPath);
            if (cameraBubble == undefined) return undefined;
            ret.top = (cameraBubble.height * (100 + ret.top)) / 200 + cameraBubble.top;
            ret.left = (cameraBubble.width * (100 + ret.left)) / 200 + cameraBubble.left;
            ret.height = (cameraBubble.height * ret.height) / 200;
            ret.width = (cameraBubble.width * ret.width) / 200;
            cameraPath = getParentPath(cameraPath);
        }
        const parentPath = getParentPath(bubblePath);
        if (parentPath != undefined) {
            const parentBubble = findBubble(parentPath);
            if (parentBubble) {
                const bubbleView = descendant2child(parentBubble, '/');
                ret = global2bubbleWithRect(ret, bubbleView);
            }
        }
        const tmp = descendant2child(bubble, '/') as Bubble;
        const visibleBubblePos = {
            height: tmp.height,
            width: tmp.width,
            top: tmp.top,
            left: tmp.left,
        };
        newCameraPos = { ...ret };
        const prevPos = { ...newCameraPos };

        const isLongHeight: boolean =
            visibleBubblePos.width * cameraViewRef.current.size.y <
            visibleBubblePos.height * cameraViewRef.current.size.x;
        const newHeight = isLongHeight ? bubble.height : (bubble.width * newCameraPos.height) / newCameraPos.width;
        const newWidth = isLongHeight ? (bubble.height * newCameraPos.width) / newCameraPos.height : bubble.width;
        const newCameraView: ViewCoord = {
            size: cameraViewRef.current.size,
            pos: {
                top: bubble.top + (bubble.height - newHeight) / 2,
                left: bubble.left + (bubble.width - newWidth) / 2,
                height: newHeight,
                width: newWidth,
            },
            path: getParentPath(bubblePath) ?? '/',
        };
        updateCameraView(newCameraView, prevPos);
        return newCameraView;
    };

    /**
     * cameraView에 대한 모든 책임
     * camera를 path에 맞게 변경하고 vameraView를 설정
     * animation 적용 여부 결정
     */
    const updateCameraView = (cameraView: ViewCoord, prevPosition?: Rect | undefined) => {
        let path = cameraView.path;
        let pos = { ...cameraView.pos };
        let prevPos = prevPosition ? { ...prevPosition } : undefined;

        while (
            path != '/' &&
            (pos.top < -100 || pos.left < -100 || pos.top + pos.height > 100 || pos.left + pos.width > 100)
        ) {
            pos = bubble2globalWithRect(pos, findBubble(path));
            if (prevPos) prevPos = bubble2globalWithRect(prevPos, findBubble(path));
            path = getParentPath(path) ?? '/';
        }
        let canUpdateCamera = true;
        while (canUpdateCamera) {
            canUpdateCamera = false;
            const children = getChildBubbles(path);
            for (const child of children) {
                // TODO isInside 유틸함수 만들기
                if (
                    child.top < pos.top &&
                    child.left < pos.left &&
                    pos.top + pos.height < child.top + child.height &&
                    pos.left + pos.width < child.left + child.width
                ) {
                    pos = global2bubbleWithRect(pos, child);
                    if (prevPos) prevPos = global2bubbleWithRect(prevPos, child);
                    path = child.path;
                    canUpdateCamera = true;
                    break;
                }
            }
        }
        if (prevPos && isShowAnimationRef.current) {
            setCameraView({
                size: cameraView.size,
                path,
                pos: prevPos,
            });
            viewTransitAnimation(prevPos, pos, 600);
        } else
            setCameraView({
                size: cameraView.size,
                path,
                pos,
            });
    };

    const viewTransitAnimation = (startViewPos: Rect, endViewPos: Rect, duration: number = 1000) => {
        let time = 0;
        modeRef.current = mode;
        setMode('animate');
        const top = Math.min(startViewPos.top, endViewPos.top);
        const left = Math.min(startViewPos.left, endViewPos.left);
        const middleViewPos: Rect = {
            top: top,
            left: left,
            height: Math.max(startViewPos.top + startViewPos.height, endViewPos.top + endViewPos.height) - top,
            width: Math.max(startViewPos.left + startViewPos.width, endViewPos.left + endViewPos.width) - left,
        };
        const intervalId = setInterval(() => {
            let pos: Rect;
            if (time < duration / 2) {
                pos = easeOutCubic(time / duration, startViewPos, middleViewPos);
            } else {
                pos = easeInCubic(time / duration, middleViewPos, endViewPos);
            }

            setCameraView({ ...cameraViewRef.current, pos: pos });
            if (time >= duration) {
                setCameraView({ ...cameraViewRef.current, pos: endViewPos });
                setMode(modeRef.current);
                clearInterval(intervalId);
            }
            time += 30;
        }, 30);
    };

    return (
        <CameraContext.Provider
            value={{
                getCameraView: () => cameraViewRef.current,
                setCameraView: setCameraView,
                zoomBubble,
                updateCameraView,
            }}
        >
            {children}
        </CameraContext.Provider>
    );
};
