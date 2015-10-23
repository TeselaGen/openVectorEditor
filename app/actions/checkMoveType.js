import assign from 'lodash/object/assign'
import ac from 've-api-check';
import trimNumberToFitWithin0ToAnotherNumber from 've-range-utils/trimNumberToFitWithin0ToAnotherNumber';
import handleCaretMoves from './handleCaretMoves'

module.exports = function checkMoveType({
    sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type
}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.number, sequenceLength);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);

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

    var updatedCaretPos = handleCaretMoves[type]({
        sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer
    });
    updatedCaretPos = trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos, sequenceLength);
    output({
        updatedCaretPos: updatedCaretPos
    });
}