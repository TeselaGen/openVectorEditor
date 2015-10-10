var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');
export default function handleCaretMovedNoSelectedNoShift({sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);
    
    var moveBy;
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
    if (moveBy > 0) {
        output({
            selectionLayer: {
                start: caretPosition,
                end: trimNumberToFitWithin0ToAnotherNumber(caretPosition + moveBy - 1, sequenceLength - 1),
                cursorAtEnd: true
            }
        });
    } else {
        output({
            selectionLayer: {
                start: trimNumberToFitWithin0ToAnotherNumber(caretPosition + moveBy, sequenceLength - 1),
                end: caretPosition - 1,
                cursorAtEnd: false
            }
        });
    }
}