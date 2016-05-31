var handleMoves = {
    moveCaretLeftOne: function ({selectionLayer, shiftHeld}) {
        if (selectionLayer.selected && !shiftHeld) {
            return 0;
        }
        return - 1;
    },
    moveCaretRightOne: function ({selectionLayer, shiftHeld}) {
        if (selectionLayer.selected && !shiftHeld) {
            return 0;
        }
        return 1;
    },
    moveCaretUpARow: function ({bpsPerRow}) {
        return  - bpsPerRow;
    },
    moveCaretDownARow: function ({bpsPerRow}) {
        return  bpsPerRow;
    },
    moveCaretToEndOfRow: function ({bpsPerRow, caretPosition}) {
        return  (bpsPerRow - (caretPosition % bpsPerRow));
    },
    moveCaretToStartOfRow: function ({bpsPerRow, caretPosition}) {
        var moveBy = -caretPosition % bpsPerRow;
        if (moveBy === 0) {
            moveBy = -bpsPerRow
        }
        return moveBy;
    },
    moveCaretToStartOfSequence: function ({caretPosition}) {
        return -caretPosition
    },
    moveCaretToEndOfSequence: function ({caretPosition, sequenceLength}) {
        return sequenceLength - caretPosition;
    },
}

function moveCaret ({input: {sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer, shiftHeld, type}, state, output}) {
    var moveBy = handleMoves[type]({shiftHeld, sequenceLength, bpsPerRow, caretPosition, newCaretPosition, selectionLayer});
    output({moveBy: moveBy});
}

moveCaret.output = {
    moveBy: Number
}

export default moveCaret;