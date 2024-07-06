import { useRef } from 'react';

type UseCurveProps = {
    sensitivity?: number;
};

export const useCurve = ({ sensitivity = 0 }: UseCurveProps = {}) => {
    const newLine = useRef<Curve>([]);
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

    const addNewLine = () => {
        lines.current = [...lines.current, newLine.current];
        newLine.current = [];
    };

    const getDrawingCurve = (): Curve => {
        return [...newLine.current];
    };

    const getCurve = (): Array<Curve> => {
        return [...lines.current, newLine.current];
    };

    return {
        getCurve,
        getDrawingCurve,
        addControlPoint,
        addNewLine,
    };
};
