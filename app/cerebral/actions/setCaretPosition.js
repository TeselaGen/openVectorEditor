var isInteger = require("is-integer");
export default function setCaretPosition({input: {caretPosition}, state, output}) {
    if (isInteger(caretPosition)) {
        state.set('caretPosition', caretPosition);
    } else {
        state.set('caretPosition', -1);
    }
}