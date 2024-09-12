import { getSquaredDistance } from '@/util/shapes/operator';
import { isRect, isCircle } from '@/util/typeGuard';

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

export const isCollisionWithRectExceptIncluding = (rectA: Rect, rectB: Rect): boolean => {
    const rect1ContainsRect2 =
        rectA.left <= rectB.left &&
        rectA.top <= rectB.top &&
        rectA.left + rectA.width >= rectB.left + rectB.width &&
        rectA.top + rectA.height >= rectB.top + rectB.height;

    const rect2ContainsRect1 =
        rectB.left <= rectA.left &&
        rectB.top <= rectA.top &&
        rectB.left + rectB.width >= rectA.left + rectA.width &&
        rectB.top + rectB.height >= rectA.top + rectA.height;
    if (rect1ContainsRect2 || rect2ContainsRect1) {
        return false;
    }
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

export const isCollisionPointWithCircle = (point: Vector2D, circle: Circle): boolean => {
    const distanceSquared =
        (point.x - circle.center.x) * (point.x - circle.center.x) +
        (point.y - circle.center.y) * (point.y - circle.center.y);
    return distanceSquared <= circle.radius * circle.radius;
};

export const isCollisionPointWithEllipse = (point: Vector2D, ellipse: Ellipse): boolean => {
    const { x, y } = point;
    const { center, width, height } = ellipse;
    const { x: h, y: k } = center;
    const a = width / 2;
    const b = height / 2;
    return ((x - h) * (x - h)) / (a * a) + ((y - k) * (y - k)) / (b * b) <= 1;
};

export const isCollisionPointWithCapsule = (point: Vector2D, capsule: Capsule): boolean => {
    let x, y;

    if (capsule.p1.x < capsule.p2.x) x = Math.max(capsule.p1.x, Math.min(capsule.p2.x, point.x));
    else x = Math.max(capsule.p2.x, Math.min(capsule.p1.x, point.x));

    if (capsule.p1.y < capsule.p2.y) y = Math.max(capsule.p1.y, Math.min(capsule.p2.y, point.y));
    else y = Math.max(capsule.p2.y, Math.min(capsule.p1.y, point.y));

    return isCollisionPointWithCircle(point, { center: { x: x, y: y }, radius: capsule.radius });
};

export const isCollisionCapsuleWithCircle = (capsule: Capsule, circle: Circle, thickness: number = 0) => {
    let x, y;

    if (capsule.p1.x < capsule.p2.x) x = Math.max(capsule.p1.x, Math.min(capsule.p2.x, circle.center.x));
    else x = Math.max(capsule.p2.x, Math.min(capsule.p1.x, circle.center.x));

    if (capsule.p1.y < capsule.p2.y) y = Math.max(capsule.p1.y, Math.min(capsule.p2.y, circle.center.y));
    else y = Math.max(capsule.p2.y, Math.min(capsule.p1.y, circle.center.y));

    return isCollisionWithCircle({ center: { x: x, y: y }, radius: thickness }, circle);
};

export const isCollisionWithCircle = (circleA: Circle, circleB: Circle): boolean => {
    return Math.sqrt(getSquaredDistance(circleA.center, circleB.center)) <= circleA.radius + circleB.radius;
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
