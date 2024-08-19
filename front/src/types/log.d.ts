// TODO Log 관련 타입 다시 정의하기
// 실수하기 좋은 타입정의임

type LogBubble = {
    type: 'update' | 'create' | 'delete' | 'move';
    object: Bubble;
    options: {
        childrenPaths?: Array<string>; // create, delete일때 사용
        prevPos?: Vector2D; // move일때 사용
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
    options: {
        newCameraView: ViewCoord;
    };
};
type LogElement = LogBubble | LogCurve | LogCamera;
type LogGroup = Array<LogElement>;

type LogState = {
    logStack: Array<LogGroup>;
    redoStack: Array<LogGroup>;
};
