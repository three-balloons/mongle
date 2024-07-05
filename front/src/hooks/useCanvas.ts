import { useState, useCallback, useRef, useEffect } from 'react';
import { useCurve } from './useCurve';
import { type Line2D } from '../util/Shapes/types/line';
import { type Point } from '../util/Shapes/types/point';
import { usePenConfig } from './usePenConfig';

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState<Point | undefined>(undefined);
  const [isPainting, setIsPainting] = useState(false);
  const [canvasImage, setCanvasImage] = useState<ImageData | null>(null);
  const [splineCount, setSplineCount] = useState<number>(0); // n번째 이후부터 spline 반영 안한 점들
  const { newLine, curves, addControlPoint, addNewLine } = useCurve({ sensitivity: 1 });
  const { applyConfig } = usePenConfig();

  const getCoordinates = (event: MouseEvent | TouchEvent): Point | undefined => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    if (event instanceof MouseEvent) {
      return {
        x: Math.round(event.offsetX),
        y: Math.round(event.offsetY),
      };
    } else {
      return {
        x: Math.round(event.touches[0].clientX - canvas.offsetLeft),
        y: Math.round(event.touches[0].clientY - canvas.offsetTop),
      };
    }
  };

  // bezier curve 적용 전 - 픽셀 단위로 그리기
  const drawLine = (originalPosition: Point, newPosition: Point) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      applyConfig(context);

      context.beginPath();
      context.moveTo(originalPosition.x, originalPosition.y);
      context.lineTo(newPosition.x, newPosition.y);
      context.stroke();
    }
  };

  const startPaint = useCallback((event: MouseEvent | TouchEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setPosition(coordinates);
      addControlPoint(coordinates, true);
    }
  }, []);

  const paint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (isPainting) {
        const newPosition = getCoordinates(event);
        if (position && newPosition && (position.x != newPosition.x || position.y != newPosition.y)) {
          if (addControlPoint(newPosition)) {
            _updateCanvas(newLine);
          }
          drawLine(position, newPosition);
          setPosition(newPosition);
        }
      }
    },
    [isPainting, position]
  );

  const exitPaint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (position) {
        addControlPoint(position, true);
      }
      _updateCanvas(newLine, true);
      setSplineCount(0);
      addNewLine();
      setIsPainting(false);
    },
    [addNewLine]
  );

  // addControlPoint가 true일 때 실행
  const _updateCanvas = (line: Line2D, isForce: boolean = false) => {
    if (!canvasRef.current) {
      return;
    }
    let splineCnt = splineCount;
    if (!isForce && splineCnt + 3 > Math.floor((line.length - 1) / 3) * 3) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      if (canvasImage) context.putImageData(canvasImage, 0, 0);
      else context.clearRect(0, 0, canvas.width, canvas.height);

      context.beginPath();

      if (line.length > 0) {
        for (let i = 1; i < line.length; i += 3) {
          context.moveTo(line[i - 1].x, line[i - 1].y);
          if (line.length - i == 1) {
            if (isForce) {
              context.lineTo(line[i].x, line[i].y);
              context.moveTo(line[i].x, line[i].y);
              splineCnt = i;
            }
            break;
          } else if (isForce && line.length - i == 2) {
            if (isForce) {
              context.quadraticCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y);
              context.moveTo(line[i + 1].x, line[i + 1].y);
              splineCnt = i + 1;
            }
            break;
          } else if (splineCnt < i) {
            console.log(line[i], i, splineCnt);
            context.bezierCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y, line[i + 2].x, line[i + 2].y);
            context.moveTo(line[i + 2].x, line[i + 2].y);
            splineCnt = i + 2;
          }
        }
      }
      setSplineCount(splineCnt);
      context.stroke();

      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      setCanvasImage(data);
    }
  };

  //   const updateCanvas = (lines: Array<Line2D>) => {
  //     if (!canvasRef.current) {
  //       return;
  //     }
  //     const canvas: HTMLCanvasElement = canvasRef.current;
  //     const context = canvas.getContext('2d');
  //     if (context) {
  //       context.clearRect(0, 0, canvas.width, canvas.height);
  //       context.strokeStyle = 'red';
  //       context.lineJoin = 'round';
  //       context.lineWidth = 10;

  //       context.beginPath();
  //       lines.map((line) => {
  //         if (line.length > 0) {
  //           context.moveTo(line[0].x, line[0].y);
  //           if (line.length < 2) {
  //             return;
  //           }
  //           console.log('line length', line.length);
  //           for (let i = 1; i < line.length; i += 3) {
  //             if (line.length - i == 1) {
  //               context.lineTo(line[i].x, line[i].y);
  //               context.moveTo(line[i].x, line[i].y);
  //               console.log('lineTo', i);
  //               break;
  //             } else if (line.length - i == 2) {
  //               context.quadraticCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y);
  //               context.moveTo(line[i + 1].x, line[i + 1].y);
  //               break;
  //             } else {
  //               context.bezierCurveTo(line[i].x, line[i].y, line[i + 1].x, line[i + 1].y, line[i + 2].x, line[i + 2].y);
  //               context.stroke();
  //             }

  //             context.moveTo(line[i + 2].x, line[i + 2].y);
  //           }
  //         }
  //         context.stroke();
  //       });
  //     }
  //   };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);

    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint);
    canvas.addEventListener('touchend', exitPaint);
    canvas.addEventListener('touchcancel', exitPaint);

    return () => {
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);

      canvas.removeEventListener('touchstart', startPaint);
      canvas.removeEventListener('touchmove', paint);
      canvas.removeEventListener('touchend', exitPaint);
      canvas.removeEventListener('touchcancel', exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  return { canvasRef, startPaint, paint, exitPaint, _updateCanvas };
};
