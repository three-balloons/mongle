// // tool for drawing user defined curve
// // DOTO:: bubble, pdf까지 확장할 것(파일 분리)
// interface Options {
//     sensitivity?: number;
// }

// const create = ({ sensitivity = 0 }: Options = {}): Paint => {
//     return {
//         newCurve: [],
//         curves: [],
//         coolTime: sensitivity,
//         sensitivity: sensitivity,
//     };
// };

// export const addControlPoint = (paint: Paint, point: Point): Paint => {
//     const { newCurve, curves, coolTime, sensitivity } = paint;
//     return {
//         newCurve: [...newCurve, point],
//         curves: curves,
//         coolTime: coolTime,
//         sensitivity: sensitivity,
//     };
// };

// export const addNewLine = (paint: Paint) => {
//     const { newCurve, curves, sensitivity } = paint;
//     return {
//         newCurve: [],
//         curves: [...curves, newCurve],
//         coolTime: sensitivity,
//         sensitivity: sensitivity,
//     };
// };

// export const updateCoolTime = (paint: Paint, setFlag: boolean = false) => {
//     const { newCurve, curves, coolTime, sensitivity } = paint;
//     return {
//         newCurve: newCurve,
//         curves: curves,
//         coolTime: setFlag || coolTime >= sensitivity ? 0 : coolTime + 1,
//         sensitivity: sensitivity,
//     };
// };

// const Painter = { create, updateCoolTime, addControlPoint, addNewLine };
// export default Painter;
