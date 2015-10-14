var ac = require('ve-api-check');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
import handleCaretMoves from './handleCaretMoves'


module.exports = function updateCaretPosByMoveType ({sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.number, sequenceLength);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);

    var updatedCaretPos = handleCaretMoves[type]({sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer});
    updatedCaretPos = trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos, sequenceLength);
    output({updatedCaretPos: updatedCaretPos});
}