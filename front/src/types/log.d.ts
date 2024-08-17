type LogBubble = {
    type: 'update' | 'create' | 'delete';
    object: Bubble;
    options: {
        childrenPaths: Array<string>;
    };
};
type LogCurve = {
    type: 'update' | 'create' | 'delete';
    object: Curve;
    options: {
        path: string;
    };
};
type LogCamera = {
    type: 'move';
    object: ViewCoord;
};
type LogElement = LogBubble | LogCurve | LogCamera;
type LogGroup = Array<LogElement>;

type LogState = {
    logStack: Array<LogGroup>;
    redoStack: Array<LogGroup>;
};
