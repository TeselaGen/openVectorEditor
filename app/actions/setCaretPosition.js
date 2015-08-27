var tree = require('../baobabTree');
var isInteger = require("is-integer");
module.exports = function setCaretPosition(newPosition) {
    if (isInteger(newPosition)) {
        tree.select('caretPosition').set(newPosition);
    } else {
        tree.select('caretPosition').set(-1);
    }
};