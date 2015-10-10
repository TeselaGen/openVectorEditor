var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');
export default function handleCaretMovedNoSelectedNoShift({sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);
    
    var moveBy;
    var updatedCaretPos;

    switch (type) {
        case ('editorClick') :
            moveBy = newCaretPosition - caretPosition
            break;
        case ('moveCaretLeftOne') :
            moveBy = -1;
            break;
        case ('moveCaretRightOne') :
            moveBy = 1;
            break;
        case ('moveCaretUpARow') :
            moveBy = -bpsPerRow;
            break;
        case ('moveCaretDownARow') :
            moveBy = bpsPerRow;
            break;
        case ('moveCaretToEndOfRow') :
            moveBy = bpsPerRow - caretPosition % bpsPerRow;
            break;
        case ('moveCaretToStartOfRow') :
            moveBy = -1 * caretPosition % bpsPerRow;
            break;
        case ('moveCaretToStartOfSequence') :
            moveBy = -1 * caretPosition;
            break;
        case ('moveCaretToEndOfSequence') :
            moveBy = sequenceLength - caretPosition;
    }
    updatedCaretPos = caretPosition + moveBy;
    updatedCaretPos = trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos, sequenceLength);
    output({caretPosition: updatedCaretPos});
}