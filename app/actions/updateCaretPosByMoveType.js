var ac = require('ve-api-check');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');

var handleMoves = {
    'editorClick': function ({newCaretPosition}) {
        return newCaretPosition
    },
    'moveCaretLeftOne': function ({caretPosition, selectionLayer, shiftHeld}) {
        if (selectionLayer.selected && !shiftHeld) {
            return selectionLayer.start;
        }
        return caretPosition - 1;
    },
    'moveCaretRightOne': function ({caretPosition, selectionLayer, shiftHeld}) {
        if (selectionLayer.selected && !shiftHeld) {
            return selectionLayer.end + 1;
        }
        return caretPosition + 1;
    },
    'moveCaretUpARow': function ({bpsPerRow, caretPosition}) {
        return caretPosition - bpsPerRow;
    },
    'moveCaretDownARow': function ({bpsPerRow, caretPosition}) {
        return caretPosition + bpsPerRow;
    },
    'moveCaretToEndOfRow': function ({bpsPerRow, caretPosition}) {
        return caretPosition + (caretPosition % (bpsPerRow - 1));
    },
    'moveCaretToStartOfRow': function ({bpsPerRow, caretPosition}) {
        return caretPosition - (caretPosition % (bpsPerRow - 1));
    },
    'moveCaretToStartOfSequence': function () {
        return 0;
    },
    'moveCaretToEndOfSequence': function ({sequenceLength}) {
        return sequenceLength;
    },
}

module.exports = function updateCaretPosByMoveType ({sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.number, sequenceLength);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);

    var updatedCaretPos = handleMoves[type]({shiftHeld, sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer});
    updatedCaretPos = trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos, sequenceLength);
    output({updatedCaretPos: updatedCaretPos});
}