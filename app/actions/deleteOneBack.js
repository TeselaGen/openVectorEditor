var deleteSequence = require('./deleteSequence');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

export default function backspacePressed({selectionLayer, caretPosition}, tree, output) {
    if (selectionLayer.selected) {
        deleteSequence(selectionLayer);
    } else {
        if (areNonNegativeIntegers([caretPosition])) {
            deleteSequence({
                start: caretPosition - 1,
                end: caretPosition - 1
            });
        } else {
            throw new Error('no caret or selection layer to delete!');
        }
    }
};