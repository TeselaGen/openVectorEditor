var setOrClearSelectionLayer = require('./setOrClearSelectionLayer.js');
var moveCaretShiftHeld = require('./moveCaretShiftHeld.js');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');

export default function moveCaret({numberToMove, shiftHeld}, tree, output) {
    ac.throw(ac.number, numberToMove);
    ac.throw(ac.bool.optional, shiftHeld);
    if (shiftHeld) {
        moveCaretShiftHeld({numberToMove}, tree);
    } else {
        var selectionLayer = tree.get('selectionLayer');
        var sequenceLength = tree.get('sequenceLength');
        var caretPosition = tree.get('caretPosition');
        if (selectionLayer.selected) {
            if (numberToMove > 0) {
                tree.set('caretPosition', selectionLayer.end + 1);
            } else {
                tree.set('caretPosition', selectionLayer.start);
            }
            setOrClearSelectionLayer(false,tree);
        } else {
            caretPosition += numberToMove;
            caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
            tree.set('caretPosition', caretPosition);
        }
    }
};