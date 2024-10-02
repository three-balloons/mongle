// point
interface Vector2D {
    x: number;
    y: number;
}
interface Point extends Vector2D {
    isVisible: boolean;
}

type Line2D = [Vector2D, Vector2D];
// curve
type Curve2D = Array<Point>;

// rectangle
interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

// circle
interface Circle {
    center: Vector2D;
    radius: number;
}

interface Capsule {
    p1: Vector2D;
    p2: Vector2D;
    radius: number;
}

interface Ellipse {
    center: Vector2D;
    width: number;
    height: number;
}
