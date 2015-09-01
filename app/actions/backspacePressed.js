/* @flow */
var tree = require('../baobabTree');
var deleteSequence = require('./deleteSequence');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

module.exports = function backspacePressed() {
    var selectionLayer = tree.select('selectionLayer').get();
    var caretPosition = tree.select('caretPosition').get();
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