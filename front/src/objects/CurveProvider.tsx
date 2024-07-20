import { useConfigStore } from '@/store/configStore';
import { createContext, useEffect, useRef } from 'react';

export type CurveContextProps = {
    // TODO viewPath, setViewPath, viewPathRef 제거하고 curve에서 path 받기
    viewPath: string;
    setViewPath: (path: string) => void;
    getCurves: () => Array<Curve>;
    clearAllCurves: () => void;
    getDrawingCurve: () => Curve2D;
    addControlPoint: (pos: Point, force?: boolean) => boolean;
    addNewCurve: (thicknessRatio?: number) => void;
    addCurve: (curve: Curve) => void;
    removeCurve: (curve: Curve) => void;
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
    const viewPathRef = useRef<string>('/');
    const CurvesRef = useRef<Curve[]>([]);
    const coolTime = useRef(sensitivity);
    const { penConfig } = useConfigStore((state) => state);

    const penConfigRef = useRef<PenConfig>(penConfig);

    useEffect(() => {
        useConfigStore.subscribe(({ penConfig }) => {
            penConfigRef.current = penConfig;
        });
    }, []);

    const clearAllCurves = () => {
        CurvesRef.current = [];
        newCurveRef.current = [];
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

    const setViewPath = (path: string) => {
        viewPathRef.current = path;
    };

    const addNewCurve = (thicknessRatio: number = 1) => {
        CurvesRef.current = [
            ...CurvesRef.current,
            {
                position: newCurveRef.current,
                path: viewPathRef.current,
                config: { ...penConfigRef.current, thickness: penConfigRef.current.thickness / thicknessRatio },
            },
        ];
        newCurveRef.current = [];
    };

    const addCurve = (curve: Curve) => {
        CurvesRef.current = [...CurvesRef.current, curve];
    };

    const removeCurve = (curveToRemove: Curve) => {
        CurvesRef.current = [...CurvesRef.current.filter((curve) => curve !== curveToRemove)];
    };

    const getDrawingCurve = (): Curve2D => {
        return [...newCurveRef.current];
    };

    const getCurves = (): Curve[] => {
        return [
            ...CurvesRef.current,
            { position: newCurveRef.current, path: viewPathRef.current, config: penConfigRef.current },
        ];
    };

    const applyPenConfig = (context: CanvasRenderingContext2D, options?: PenConfig) => {
        if (!options) options = penConfigRef.current;
        context.strokeStyle = options.color as string;
        context.fillStyle = options.color as string;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.lineWidth = options.thickness;
        context.globalAlpha = options.alpha;
    };

    const setThicknessWithRatio = (context: CanvasRenderingContext2D, thicknessRatio: number) => {
        context.lineWidth = context.lineWidth * thicknessRatio;
    };

    return (
        <CurveContext.Provider
            value={{
                viewPath: viewPathRef.current,
                setViewPath,
                clearAllCurves,
                getCurves,
                getDrawingCurve,
                addControlPoint,
                addNewCurve,
                addCurve,
                removeCurve,
                applyPenConfig,
                setThicknessWithRatio,
            }}
        >
            {children}
        </CurveContext.Provider>
    );
};
