import { WORKSPACE_INNER_SIZE } from '@/util/constant';

/**
 * x: 2bytes
 * y: 2bytes
 * isVisible: 1bytes
 * */
export const curveEncoding = (position: Curve2D): string => {
    const buffer = new ArrayBuffer(position.length * 5);
    const view = new DataView(buffer);

    position.forEach(({ x, y, isVisible }, index) => {
        view.setUint16(index * 5, Math.floor(x / WORKSPACE_INNER_SIZE), true);
        view.setUint16(index * 5 + 2, Math.floor(y / WORKSPACE_INNER_SIZE), true);
        view.setUint8(index * 5 + 4, isVisible ? 1 : 0);
    });
    const uint8Array = new Uint8Array(buffer);
    let binary = '';
    uint8Array.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
};

export const curveDecoding = (base64: string): Curve2D => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < length; i++) {
        view[i] = binaryString.charCodeAt(i);
    }

    const dataView = new DataView(buffer);
    const position: Curve2D = [];
    const positionLength = buffer.byteLength / 5;

    for (let i = 0; i < positionLength; i++) {
        position.push({
            x: dataView.getUint16(i * 5, true),
            y: dataView.getUint16(i * 5, true),
            isVisible: dataView.getUint8(i * 5 + 4) == 1 ? true : false,
        });
    }
    return position;
};
