var moveCaret = require('./moveCaret');

const moveCaretShortcutFunctions = {
        moveCaretLeftOne(shiftHeld) {
            moveCaret(-1, shiftHeld);
        },
        moveCaretRightOne(shiftHeld) {
            moveCaret(1, shiftHeld);
        },
        moveCaretUpARow(shiftHeld) {
            var bpsPerRow = tree.get(['bpsPerRow']);
            moveCaret(-bpsPerRow, shiftHeld);
        },
        moveCaretDownARow(shiftHeld) {
            var bpsPerRow = tree.get(['bpsPerRow']);
            moveCaret(bpsPerRow, shiftHeld);
        },
        moveCaretToEndOfRow(shiftHeld) {
            var bpsPerRow = tree.get(['bpsPerRow']);
            var caretPosition = getCaretPosition();
            var moveBy = bpsPerRow - caretPosition % bpsPerRow;
            moveCaret(moveBy, shiftHeld);
        },
        moveCaretToStartOfRow(shiftHeld) {
            var bpsPerRow = tree.get(['bpsPerRow']);
            var caretPosition = getCaretPosition();
            var moveBy = -1 * caretPosition % bpsPerRow;
            moveCaret(moveBy, shiftHeld);
        },
        moveCaretToStartOfSequence(shiftHeld) {
            var caretPosition = getCaretPosition();
            var moveBy = -1 * caretPosition;
            moveCaret(moveBy, shiftHeld);
        },
        moveCaretToEndOfSequence(shiftHeld) {
            var caretPosition = getCaretPosition();
            var sequenceLength = tree.get('sequenceLength');
            var moveBy = sequenceLength - caretPosition;
            moveCaret(moveBy, shiftHeld);
        },
};

function getCaretPosition() {
    var caretPosition = tree.get(['caretPosition']);
    if (caretPosition === -1) {
        var selectionLayer = tree.get(['selectionLayer']);
        if (selectionLayer.selected) {
            if (selectionLayer.cursorAtEnd) {
                caretPosition = selectionLayer.end + 1;
            } else {
                caretPosition = selectionLayer.start;
            }
        }
    }
    return caretPosition;
}

export default moveCaretShortcutFunctions;