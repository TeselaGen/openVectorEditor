var isInteger = require("is-integer");
export default function setCaretPosition(newPosition, tree, output) {
    if (isInteger(newPosition)) {
        tree.set('caretPosition', newPosition);
    } else {
        tree.set('caretPosition', -1);
    }
}