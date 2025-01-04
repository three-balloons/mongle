export const addVector2D = (p1: Vector2D, p2: Vector2D): Vector2D => {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
};

export const subVector2D = (p1: Vector2D, p2: Vector2D): Vector2D => {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
};

export const getSquaredDistance = (p1: Vector2D, p2: Vector2D): number => {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
};

export const distancePointToLine = (point: Vector2D, line: Line2D): number => {
    const [p1, p2] = line;

    const distanceSquared = getSquaredDistance(p1, p2);
    if (distanceSquared === 0) return Math.sqrt(getSquaredDistance(point, p1));

    let t = ((point.x - p1.x) * (p2.x - p1.x) + (point.y - p1.y) * (p2.y - p1.y)) / distanceSquared;
    t = Math.max(0, Math.min(1, t));

    const projection: Vector2D = { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
    return Math.sqrt(getSquaredDistance(point, projection));
};
