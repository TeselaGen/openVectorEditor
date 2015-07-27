var tree = require('../baobabTree');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

module.exports = function backspacePressed() {
    var selectionLayer = tree.select('vectorEditorState', 'selectionLayer').get();
    var caretPosition = tree.select('vectorEditorState', 'caretPosition').get();
    if (selectionLayer.selected) {
        this.deleteSequence(selectionLayer);
    } else {
        if (areNonNegativeIntegers([caretPosition])) {
            this.deleteSequence({
                start: caretPosition - 1,
                end: caretPosition - 1
            });
        } else {
            throw 'no caret or selection layer to delete!';
        }
    }
}