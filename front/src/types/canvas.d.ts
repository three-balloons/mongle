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
    font: 'serif';
    fontSize: number;
    fontWeight: 'normal' | 'bold' | number;
};

type Font = 'Arial' | 'Courier New' | 'Georgia' | 'Times New Roman' | 'Trebuchet MS' | 'Verdana';

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

// coordinate
type HierarchyCoord = {
    path: string;
};
type PolarCoord = {
    radius: number;
    angle: number;
};
type RectCoord = {
    top: number;
    left: number;
};
