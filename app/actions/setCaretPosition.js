var tree = require('../baobabTree');
var isInteger = require("is-integer");
module.exports = function setCaretPosition(newPosition) {
    if (isInteger(newPosition)) {
        tree.select('vectorEditorState', 'caretPosition').set(newPosition);
    } else {
        tree.select('vectorEditorState', 'caretPosition').set(-1);
    }
};