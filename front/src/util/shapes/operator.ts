export const addVector2D = (p1: Vector2D, p2: Vector2D): Vector2D => {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
};

export const subVector2D = (p1: Vector2D, p2: Vector2D): Vector2D => {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
};

export const distanceSquare = (p1: Vector2D, p2: Vector2D): number => {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
};
