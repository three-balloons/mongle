// type LogAction = { type: 'UNDO' } | { type: 'REDO' } | { type: 'PUSH_LOG'; payload: { log: LogGroup } };

// export const LogReducer = (state: LogState, action: LogAction): LogState => {
//     switch (action.type) {
//         case 'UNDO': {
//             const obj = state.logStack[state.logStack.length - 1];
//             const newLogStack = [...state.logStack];
//             newLogStack.pop();
//             return { logStack: newLogStack, redoStack: [...state.redoStack, obj] };
//         }
//         case 'REDO': {
//             const obj = state.redoStack[state.redoStack.length - 1];
//             const newRedoStack = [...state.redoStack];
//             newRedoStack.pop();
//             return { logStack: [...state.logStack, obj], redoStack: newRedoStack };
//         }
//         case 'PUSH_LOG': {
//             return {
//                 ...state,
//                 logStack: [...state.logStack, action.payload.log],
//             };
//         }
//         default:
//             return state;
//     }
// };
