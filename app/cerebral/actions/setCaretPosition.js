var isInteger = require("is-integer");
export default function setCaretPosition({caretPosition}, tree, output) {
    if (isInteger(caretPosition)) {
        tree.set('caretPosition', caretPosition);
    } else {
        tree.set('caretPosition', -1);
    }
}