// Coordinate systems

/**
 * (canvas) View coordinate system
 * @field path canvas path
 * @field pos relative position
 * @field size canvas size in screen
 */
type ViewCoord = {
    pos: Rect;
    path: string;
    size: Vector2D;
};

/**
 * Poloar coordinate system
 * @field angle: [0, 360), radius: (0, 100] except for root
 */
type PolarCoord = {
    path: string;
    radius: number;
    angle: number;
};

/**
 * Cartesian coordinate system
 * @field x: [-100, 100], y: [-100, 100] except for root
 */
type RectCoord = {
    path: string;
    x: number;
    y: number;
};