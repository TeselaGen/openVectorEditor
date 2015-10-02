var setSelectionLayer = require('./setSelectionLayer.js');
var moveCaretShiftHeld = require('./moveCaretShiftHeld.js');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');

export default function moveCaret({numberToMove, shiftHeld}, tree, output) {
    ac.warn(ac.number, numberToMove);
    ac.warn(ac.bool.optional, shiftHeld);
    if (shiftHeld) {
        moveCaretShiftHeld(numberToMove);
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
            setSelectionLayer(false);
        } else {
            caretPosition += numberToMove;
            caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
            tree.set('caretPosition', caretPosition);
        }
    }
};