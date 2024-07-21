// depend on web
export const getViewCoordinate = (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): Vector2D => {
    if (event instanceof MouseEvent) {
        return {
            x: Math.round(event.clientX) - canvas.offsetLeft,
            y: Math.round(event.clientY) - canvas.offsetTop,
        };
    } else {
        return {
            x: Math.round(event.touches[0].clientX - canvas.offsetLeft),
            y: Math.round(event.touches[0].clientY - canvas.offsetTop),
        };
    }
};

export const getTouchCount = (event: MouseEvent | TouchEvent) => {
    if (event instanceof TouchEvent) return event.touches.length;
    return 0;
};

export const getSecondTouchCoordinate = (
    event: MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement,
): Vector2D | undefined => {
    if (event instanceof TouchEvent) {
        if (event.touches.length == 2) {
            return {
                x: Math.round(event.touches[1].clientX - canvas.offsetLeft),
                y: Math.round(event.touches[1].clientY - canvas.offsetTop),
            };
        }
    }
    return undefined;
};
