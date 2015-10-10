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
            updatedCaretPos = newCaretPosition
            break;
        case ('moveCaretLeftOne') :
            updatedCaretPos = selectionLayer.start;
            break;
        case ('moveCaretRightOne') :
            updatedCaretPos = selectionLayer.end + 1;
            break;
        case ('moveCaretUpARow') :
            updatedCaretPos = caretPosition -bpsPerRow;
            break;
        case ('moveCaretDownARow') :
            updatedCaretPos = caretPosition + bpsPerRow;
            break;
        case ('moveCaretToEndOfRow') :
            updatedCaretPos = caretPosition + - (caretPosition % (bpsPerRow - 1));
            break;
        case ('moveCaretToStartOfRow') :
            updatedCaretPos = caretPosition - caretPosition % bpsPerRow;
            break;
        case ('moveCaretToStartOfSequence') :
            updatedCaretPos = 0;
            break;
        case ('moveCaretToEndOfSequence') :
            updatedCaretPos = sequenceLength;
    }
    updatedCaretPos = caretPosition + moveBy;
    updatedCaretPos = trimNumberToFitWithin0ToAnotherNumber(updatedCaretPos, sequenceLength);
    output({caretPosition: updatedCaretPos});
}