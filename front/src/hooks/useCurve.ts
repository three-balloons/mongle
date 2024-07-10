import { useRef } from 'react';
import { useConfigStore } from '@/store/configStore';

type UseCurveProps = {
    sensitivity?: number;
};

export const useCurve = ({ sensitivity = 0 }: UseCurveProps = {}) => {
    const newCurveRef = useRef<Curve2D>([]);
    const viewPathRef = useRef<string>('/');
    const { penConfig } = useConfigStore((state) => state);
    const CurvesRef = useRef<Array<Curve>>([]);
    const coolTime = useRef(sensitivity);
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
            { position: newCurveRef.current, path: viewPathRef.current, config: penConfig },
        ];
        newCurveRef.current = [];
    };

    const getDrawingCurve = (): Curve2D => {
        return [...newCurveRef.current];
    };

    const getCurves = (): Array<Curve> => {
        return [...CurvesRef.current, { position: newCurveRef.current, path: viewPathRef.current, config: penConfig }];
    };

    return {
        viewPath: viewPathRef.current,
        setViewPath,
        getCurves,
        getDrawingCurve,
        addControlPoint,
        addNewLine,
    };
};
