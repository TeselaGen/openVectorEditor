import assign from 'lodash/object/assign'
var ac = require('ve-api-check');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
import handleCaretMoves from './handleCaretMoves'

module.exports = function updateCaretPosByMoveTypeCancelSel({
    sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type
}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.number, sequenceLength);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);

    if (selectionLayer.selected && !shiftHeld) {
        assign(handleCaretMoves, {
            moveCaretLeftOne: function({
                selectionLayer
            }) {
                return selectionLayer.start;
            },
            moveCaretRightOne: function({
                selectionLayer
            }) {
                return selectionLayer.end + 1;
            }
        })
    }

    var updatedCaretPos = handleCaretMoves[type]({
        sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer
    });
    updatedCaretPos = trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos, sequenceLength);
    output({
        updatedCaretPos: updatedCaretPos
    });
}