import { useState } from 'react';
import { type Point } from '../util/Shapes/types/point';
import { type Line2D } from '../util/Shapes/types/line';

type UseCurveProps = {
  sensitivity?: number;
};

export const useCurve = ({ sensitivity = 0 }: UseCurveProps = {}) => {
  const [newLine, setNewLine] = useState<Line2D>([]);
  const [lines, setLines] = useState<Array<Line2D>>([]);

  const [coolTime, setCoolTime] = useState(sensitivity);

  const addControlPoint = (pos: Point, force: boolean = false) => {
    if (force || coolTime >= sensitivity) {
      setNewLine([...newLine, pos]);
      setCoolTime(0);
      return true;
    } else {
      setCoolTime(coolTime + 1);
      return false;
    }
  };

  const addNewLine = () => {
    console.log(newLine.length);
    setLines([...lines, newLine]);
    setNewLine([]);
  };

  return {
    curves: [...lines, newLine],
    newLine,
    addControlPoint,
    addNewLine,
  };
};
