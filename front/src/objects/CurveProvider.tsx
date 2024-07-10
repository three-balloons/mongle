import { useConfigStore } from '@/store/configStore';
import { createContext, useEffect, useRef } from 'react';

export type CurveContextProps = {
    viewPath: string;
    setViewPath: (path: string) => void;
    getCurves: () => Curve[];
    getDrawingCurve: () => Curve2D;
    addControlPoint: (pos: Point, force?: boolean) => boolean;
    addNewLine: () => void;
    applyPenConfig: (context: CanvasRenderingContext2D, options?: PenConfig) => void;
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

    const penConfigRef = useRef<PenConfig>({
        color: 'black',
        thickness: 3,
        alpha: 1,
    });

    useEffect(() => {
        useConfigStore.subscribe(({ penConfig }) => {
            penConfigRef.current = penConfig;
        });
    }, []);

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

    const addNewLine = () => {
        CurvesRef.current = [
            ...CurvesRef.current,
            { position: newCurveRef.current, path: viewPathRef.current, config: penConfigRef.current },
        ];
        newCurveRef.current = [];
    };

    const getDrawingCurve = (): Curve2D => {
        console.log(newCurveRef.current);
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

    return (
        <CurveContext.Provider
            value={{
                viewPath: viewPathRef.current,
                setViewPath,
                getCurves,
                getDrawingCurve,
                addControlPoint,
                addNewLine,
                applyPenConfig,
            }}
        >
            {children}
        </CurveContext.Provider>
    );
};
