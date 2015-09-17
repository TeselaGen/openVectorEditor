var tree = require('../baobabTree');
var setSelectionLayer = require('./setSelectionLayer.js');
var moveCaretShiftHeld = require('./moveCaretShiftHeld.js');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');

module.exports = function moveCaret(numberToMove, shiftHeld) {
    ac.warn(ac.number, numberToMove);
    ac.warn(ac.bool.optional, shiftHeld);
    if (shiftHeld) {
        moveCaretShiftHeld(numberToMove);
    } else {
        var selectionLayer = tree.select('selectionLayer').get();
        var sequenceLength = tree.get(['sequenceLength']);
        var caretPosition = tree.select('caretPosition').get();
        if (selectionLayer.selected) {
            if (numberToMove > 0) {
                tree.select('caretPosition').set(selectionLayer.end + 1);
            } else {
                tree.select('caretPosition').set(selectionLayer.start);
            }
            setSelectionLayer(false);
        } else {
            caretPosition += numberToMove;
            caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
            tree.select('caretPosition').set(caretPosition);
        }
    }
};