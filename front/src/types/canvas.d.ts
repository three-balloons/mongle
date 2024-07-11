type PenConfig = {
    color: Color;
    thickness: number;
    alpha: number;
};

type TextConfig = {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | number;
    font: Font;
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
    | 'pink';

type ControlMode = 'move' | 'draw' | 'erase';

// Coordinate systems

// (canvas) View coordinate system
// path: canvas path
// pos: relative position
// size: canvas size in screen
type ViewCoord = {
    pos: Rect;
    path: string;
    size: Vector2D;
};

// Poloar coordinate system
// angle: [0, 360), radius: (0, 100] except for root
type PolarCoord = {
    path: string;
    radius: number;
    angle: number;
};

// Cartesian coordinate system
// x: [-100, 100], y: [-100, 100] except for root
type RectCoord = {
    path: string;
    x: number;
    y: number;
};
