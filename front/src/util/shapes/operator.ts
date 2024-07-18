export const addPoint = (p1: Point, p2: Point): Point => {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
};

export const subPoint = (p1: Point, p2: Point): Point => {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
};
