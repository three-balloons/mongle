export const getViewCoordinate = (event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): Point => {
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
