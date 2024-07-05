import { type Rect, isRect } from './types/Rect';
import { type Point2D } from './types/point';

export const isCollision = (shapeA: Rect, shapeB: Rect) => {
  if (isRect(shapeA) && isRect(shapeB)) {
    if (
      shapeA.left < shapeB.left + shapeB.width &&
      shapeB.left < shapeA.left + shapeA.width &&
      shapeA.top < shapeB.top + shapeB.height &&
      shapeB.top < shapeA.top + shapeA.height
    )
      return true;
    return false;
  }
};

export const points2Rect = (points: Array<Point2D>, offset: number = 0): Rect | undefined => {
  if (points.length == 0) return undefined;
  let top = points[0].y;
  let bottom = points[0].y;
  let left = points[0].x;
  let right = points[0].x;
  points.forEach((point) => {
    top = Math.min(top, point.y);
    bottom = Math.max(top, point.y);
    left = Math.min(top, point.y);
    right = Math.max(top, point.y);
  });
  return {
    top: top - offset,
    left: left - offset,
    width: right - left + 2 * offset,
    height: bottom - top + 2 * offset,
  };
};
