var ac = require('ve-api-check');
export default function checkMoveType({caretPosition, selectionLayer, shiftHeld, type}, tree, output) {
    ac.throw(ac.number, caretPosition);
    ac.throw(ac.bool.optional, shiftHeld);
    ac.throw(ac.object, selectionLayer);
    ac.throw(ac.string, type);
    var bpsPerRow = tree.get(['bpsPerRow']);
    var moveBy;

    switch (type) {
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
            var sequenceLength = tree.get('sequenceLength');
            moveBy = sequenceLength - caretPosition;
    }

    if (shiftHeld) {
        output.shiftHeld({moveBy})
    } else {
        output.noShift({moveBy})
    }
}

//
checkMoveType.outputs = [
    'shiftHeld',
    'noShift'
]


