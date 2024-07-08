import { useRef } from 'react';
import { useConfigStore } from '@/store/configStore';

type UseCurveProps = {
    sensitivity?: number;
};

export const useCurve = ({ sensitivity = 0 }: UseCurveProps = {}) => {
    const newLine = useRef<Curve2D>([]);
    const currentPath = useRef<string>('/');
    // const currentConfig = useRef<PenConfig | undefined>(undefined);
    const { penConfig } = useConfigStore((state) => state);
    const lines = useRef<Array<Curve>>([]);
    const coolTime = useRef(sensitivity);
    const addControlPoint = (pos: Point, force: boolean = false) => {
        if (force || coolTime.current >= sensitivity) {
            newLine.current = [...newLine.current, pos];
            coolTime.current = 0;
            return true;
        } else {
            coolTime.current += 1;
            return false;
        }
    };

    const setPath = (path: string) => {
        currentPath.current = path;
    };

    const addNewLine = () => {
        lines.current = [...lines.current, { position: newLine.current, path: currentPath.current, config: penConfig }];
        newLine.current = [];
    };

    const getDrawingCurve = (): Curve2D => {
        return [...newLine.current];
    };

    const getCurve = (): Array<Curve> => {
        return [...lines.current, { position: newLine.current, path: currentPath.current, config: penConfig }];
    };

    return {
        currentPath: currentPath.current,
        setPath,
        getCurve,
        getDrawingCurve,
        addControlPoint,
        addNewLine,
    };
};
