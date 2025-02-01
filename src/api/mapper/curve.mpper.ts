export const curveMapper = (curveRes: Curve): Curve => {
    return {
        ...curveRes,
        type: 'curve',
    };
};
