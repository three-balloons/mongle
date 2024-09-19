import { useBubble } from '@/objects/bubble/useBubble';
import { useConfigStore } from '@/store/configStore';
import { createContext, useEffect, useRef } from 'react';

export type CurveContextProps = {
    getNewCurvePath: () => string;
    setNewCurvePath: (path: string) => void;
    getNewCurve: () => Curve2D;
    setNewCurve: (curve: Curve2D) => void;
    addControlPoint: (pos: Point, force?: boolean) => boolean;
    addNewCurve: (thicknessRatio?: number) => Curve;
    addCurve: (path: string, curve: Curve) => void;
    setSelectedCurve: (curves: Array<Curve>) => void;
    getSelectedCurve: () => Array<Curve>;
    removeCurve: (path: string, curveToRemove: Curve) => void;
    removeCurvesWithPath: (path: string) => void;
    applyPenConfig: (context: CanvasRenderingContext2D, options?: PenConfig) => void;
    setThicknessWithRatio: (context: CanvasRenderingContext2D, thicknessRatio: number) => void;
};

export const CurveContext = createContext<CurveContextProps | undefined>(undefined);

type CurveProviderProps = {
    children: React.ReactNode;
    sensitivity?: number;
};

export const CurveProvider: React.FC<CurveProviderProps> = ({ children, sensitivity = 0 }) => {
    const newCurveRef = useRef<Curve2D>([]);
    const newCurvePathRef = useRef<string>('/');
    // editor에 의해 선택된 커브를 나타냄
    const selectedCurveRef = useRef<Array<Curve>>([]);
    const coolTime = useRef(sensitivity);
    const { penConfig } = useConfigStore((state) => state);
    const { findBubble } = useBubble();

    const penConfigRef = useRef<PenConfig>(penConfig);

    useEffect(() => {
        useConfigStore.subscribe(({ penConfig }) => {
            penConfigRef.current = penConfig;
        });
    }, []);

    const setNewCurvePath = (path: string) => {
        newCurvePathRef.current = path;
    };

    const getNewCurvePath = () => {
        return newCurvePathRef.current;
    };

    const addControlPoint = (pos: Point, force: boolean = false) => {
        if (force || coolTime.current >= sensitivity) {
            newCurveRef.current = [...newCurveRef.current, pos];
            coolTime.current = 0;
            return true;
        } else {
            coolTime.current += 1;
            return false;
        }
    };

    const addNewCurve = (thicknessRatio: number = 1): Curve => {
        const newCurve: Curve = {
            position: newCurveRef.current,
            config: { ...penConfigRef.current, thickness: penConfigRef.current.thickness / thicknessRatio },
            isVisible: true,
            id: undefined,
        };
        const bubble = findBubble(newCurvePathRef.current);
        if (bubble) bubble.curves = [...bubble.curves, newCurve];
        newCurveRef.current = [];
        return newCurve;
    };

    const setSelectedCurve = (curves: Array<Curve>) => {
        selectedCurveRef.current = curves;
    };

    const getSelectedCurve = () => {
        return selectedCurveRef.current;
    };

    const addCurve = (path: string, curve: Curve) => {
        const bubble = findBubble(path);
        if (bubble) bubble.curves = [...bubble.curves, curve];
    };

    const removeCurve = (path: string, curveToRemove: Curve) => {
        const bubble = findBubble(path);
        if (bubble) {
            bubble.curves = [...bubble.curves.filter((curve) => curve != curveToRemove)];
        }
    };

    const removeCurvesWithPath = (path: string) => {
        const bubble = findBubble(path);
        if (bubble) bubble.curves = [];
    };

    const getNewCurve = (): Curve2D => {
        return [...newCurveRef.current];
    };

    const setNewCurve = (curve: Curve2D) => {
        newCurveRef.current = [...curve];
    };

    const applyPenConfig = (context: CanvasRenderingContext2D, options?: PenConfig) => {
        if (!options) options = penConfigRef.current;
        context.strokeStyle = options.color as string;
        context.fillStyle = options.color as string;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = options.thickness;
    };

    const setThicknessWithRatio = (context: CanvasRenderingContext2D, thicknessRatio: number) => {
        context.lineWidth = context.lineWidth * thicknessRatio;
    };

    return (
        <CurveContext.Provider
            value={{
                getNewCurvePath,
                getNewCurve,
                setNewCurve,
                setNewCurvePath,
                addControlPoint,
                addNewCurve,
                setSelectedCurve,
                getSelectedCurve,
                addCurve,
                removeCurve,
                removeCurvesWithPath,
                applyPenConfig,
                setThicknessWithRatio,
            }}
        >
            {children}
        </CurveContext.Provider>
    );
};
