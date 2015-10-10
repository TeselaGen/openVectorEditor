var assign = require('lodash/object/assign');
var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');
export default function handleCaretMovedNoSelectedNoShift({sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.number.optional, newCaretPosition);
    ac.throw(ac.string, type);
    
    // var moveBy;
    // var updatedSelectionLayer = assign({}, selectionLayer);;

    // switch (type) {
    //     case ('editorClick') :
    //         if (selectionLayer.start < selectionLayer.end) {
    //             if (newCaretPosition < selectionLayer.start) {
    //                 updatedSelectionLayer = {
    //                     start: selectionLayer.start;
    //                     end: selectionLayer.end;

    //                 }
    //             }
    //         }
    //         updatedCaretPos = newCaretPosition
    //         break;
    //     case ('moveCaretLeftOne') :
    //         updatedCaretPos = selectionLayer.start;
    //         break;
    //     case ('moveCaretRightOne') :
    //         updatedCaretPos = selectionLayer.end + 1;
    //         break;
    //     case ('moveCaretUpARow') :
    //         updatedCaretPos = caretPosition -bpsPerRow;
    //         break;
    //     case ('moveCaretDownARow') :
    //         updatedCaretPos = caretPosition + bpsPerRow;
    //         break;
    //     case ('moveCaretToEndOfRow') :
    //         updatedCaretPos = caretPosition + - (caretPosition % (bpsPerRow - 1));
    //         break;
    //     case ('moveCaretToStartOfRow') :
    //         updatedCaretPos = caretPosition - caretPosition % bpsPerRow;
    //         break;
    //     case ('moveCaretToStartOfSequence') :
    //         updatedCaretPos = 0;
    //         break;
    //     case ('moveCaretToEndOfSequence') :
    //         updatedCaretPos = sequenceLength;
    // }
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
    var newSelectionLayer = assign({}, selectionLayer);
    if (newSelectionLayer.cursorAtEnd) {
        newSelectionLayer.end += moveBy;
        newSelectionLayer.end = trimNumberToFitWithin0ToAnotherNumber(newSelectionLayer.end, sequenceLength - 1);
    } else {
        newSelectionLayer.start += moveBy;
        newSelectionLayer.start = trimNumberToFitWithin0ToAnotherNumber(newSelectionLayer.start, sequenceLength - 1);
    }
    output({
        selectionLayer: newSelectionLayer
    });
}