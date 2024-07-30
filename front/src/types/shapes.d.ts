// point
interface Vector2D {
    x: number;
    y: number;
}
interface Vector3D {
    x: number;
    y: number;
    z: number;
}
interface Point extends Vector2D {
    isVisible: boolean;
}

type Line2D = [Vector2D, Vector2D];
// curve
type Curve2D = Array<Point>;
type Curve3D = Array<Vector3D>;

// TODO: penConfig 추가할 것
type Curve = { position: Curve2D; path: string; config: PenConfig; isVisible: boolean };

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

interface Bubble extends Rect {
    path: string;
    curves: Array<Curve>;
    children: Array<Bubble>;
    parent: Bubble | undefined;
    isBubblized: boolean;
    isVisible: boolean;
}
