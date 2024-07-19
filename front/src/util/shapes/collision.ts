import { isRect, isCircle } from '@/util/shapes/typeGuard';

export const isCollisionRectWithCircle = (rect: Rect, circle: Circle): boolean => {
    const { x: circleX, y: circleY } = circle.center;
    const { top, left, width, height } = rect;
    const closestX = Math.max(left, Math.min(circleX, left + width));
    const closestY = Math.max(top, Math.min(circleY, top + height));
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared <= circle.radius * circle.radius;
};

export const isCollisionWithRect = (rectA: Rect, rectB: Rect): boolean => {
    if (
        rectA.left < rectB.left + rectB.width &&
        rectB.left < rectA.left + rectA.width &&
        rectA.top < rectB.top + rectB.height &&
        rectB.top < rectA.top + rectA.height
    )
        return true;
    return false;
};

export const isCollisionPointWithRect = (point: Vector2D, rect: Rect): boolean => {
    if (
        rect.left < point.x &&
        point.x < rect.left + rect.width &&
        rect.top < point.y &&
        point.y < rect.top + rect.height
    )
        return true;
    return false;
};

export const isCollisionWithCircle = (circleA: Circle, circleB: Circle): boolean => {
    return true;
};

type Shape = Rect | Circle;
export const isCollision = (shapeA: Shape, shapeB: Shape) => {
    if (isRect(shapeA) && isRect(shapeB)) {
        return isCollisionWithRect(shapeA, shapeB);
    } else if (isCircle(shapeA) && isRect(shapeB)) {
        return isCollisionRectWithCircle(shapeB, shapeA);
    } else if (isRect(shapeA) && isCircle(shapeB)) {
        return isCollisionRectWithCircle(shapeA, shapeB);
    } else if (isCircle(shapeA) && isCircle(shapeB)) {
        return isCollisionWithCircle(shapeA, shapeB);
    }
};
