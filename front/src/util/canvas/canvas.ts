export const getViewCoordinate = (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): Point | undefined => {
    if (event instanceof MouseEvent) {
        return {
            x: Math.round(event.offsetX),
            y: Math.round(event.offsetY),
        };
    } else {
        return {
            x: Math.round(event.touches[0].clientX - canvas.offsetLeft),
            y: Math.round(event.touches[0].clientY - canvas.offsetTop),
        };
    }
};
