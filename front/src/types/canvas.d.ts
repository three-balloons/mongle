type Paint = {
    newCurve: Curve;
    curves: Array<Curve>;
    coolTime: number;
    sensitivity: number;
};

type PenConfig = {
    color: Color;
    thickness: number;
    alpha: number;
    font: Font;
};

type TextConfig = {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | number;
};

type Font = 'serif' | 'Arial' | 'Courier New' | 'Georgia' | 'Times New Roman' | 'Trebuchet MS' | 'Verdana';

type Color =
    | 'black'
    | 'silver'
    | 'gray'
    | 'white'
    | 'maroon'
    | 'red'
    | 'purple'
    | 'fuchsia'
    | 'green'
    | 'lime'
    | 'olive'
    | 'yellow'
    | 'navy'
    | 'blue'
    | 'teal'
    | 'aqua'
    | 'orange'
    | 'pink'
    | Vector3D;

// Coordinate systems

// (canvas) View coordinate system
// path: canvas path
// pos: relative position
// size: canvas size in screen
type ViewCoordSys = {
    pos: Rect;
    path: string;
    size: Vector2D;
};

// Poloar coordinate system
// angle: [0, 360), radius: (0, 100] except for root
type PolarCoordSys = {
    path: string;
    radius: number;
    angle: number;
};

// Cartesian coordinate system
// x: [-100, 100], y: [-100, 100] except for root
type RectCoordSys = {
    path: string;
    x: number;
    y: number;
};
