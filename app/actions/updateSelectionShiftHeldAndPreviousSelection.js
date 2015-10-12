var assign = require('lodash/object/assign');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');
export default function updateSelectionShiftHeldAndPreviousSelection({updatedCaretPos, sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);
    var oldCaretPos = getCaretFromSelection(selectionLayer);

    function getCaretFromSelection (selectionLayer) {
        if (selectionLayer.cursorAtEnd) {
            return selectionLayer.end + 1;
        } else {
            return selectionLayer.start;
        }
    }
    var newSelectionLayer = assign({}, selectionLayer);
    if (newSelectionLayer.cursorAtEnd) {
        newSelectionLayer.end = updatedCaretPos - 1;
        newSelectionLayer.end = trimNumberToFitWithin0ToAnotherNumber(newSelectionLayer.end, sequenceLength - 1);
        if (newSelectionLayer.end + 1 === selectionLayer.start && updatedCaretPos < oldCaretPos) {
            newSelectionLayer = false;
        }
    } else {
        newSelectionLayer.start = updatedCaretPos;
        newSelectionLayer.start = trimNumberToFitWithin0ToAnotherNumber(newSelectionLayer.start, sequenceLength - 1);
        if (newSelectionLayer.start - 1 === selectionLayer.start && updatedCaretPos > oldCaretPos) {
            newSelectionLayer = false;
        }
    }
    output({
        selectionLayer: newSelectionLayer,
    });
}