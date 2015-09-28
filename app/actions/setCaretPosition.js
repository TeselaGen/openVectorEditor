var isInteger = require("is-integer");
export default function setCaretPosition({newPosition}, tree, output) {
    if (isInteger(newPosition)) {
        tree.select('caretPosition').set(newPosition);
    } else {
        tree.select('caretPosition').set(-1);
    }
}