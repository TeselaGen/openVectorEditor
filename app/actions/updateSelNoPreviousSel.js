var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');
export default function updateSelNoPreviousSel({updatedCaretPos, sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);

    if (updatedCaretPos === caretPosition) {
        //cancel selection
        output({selectionLayer: false});
    } else if (updatedCaretPos > caretPosition) {
        output({
            selectionLayer: {
                start: caretPosition,
                end: trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos - 1, sequenceLength - 1),
                cursorAtEnd: true
            }
        });
    }
    else {
        output({
            selectionLayer: {
                start: trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos, sequenceLength - 1),
                end: caretPosition - 1,
                cursorAtEnd: false
            }
        });
    }
}
