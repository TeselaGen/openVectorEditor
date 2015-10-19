var handleCaretMoves = {
    'editorClick': function ({newCaretPosition}) {
        return newCaretPosition
    },
    'moveCaretLeftOne': function ({caretPosition}) {
        return caretPosition - 1;
    },
    'moveCaretRightOne': function ({caretPosition}) {
        return caretPosition + 1;
    },
    'moveCaretUpARow': function ({bpsPerRow, caretPosition}) {
        return caretPosition - bpsPerRow;
    },
    'moveCaretDownARow': function ({bpsPerRow, caretPosition}) {
        return caretPosition + bpsPerRow;
    },
    'moveCaretToEndOfRow': function ({bpsPerRow, caretPosition}) {
        return caretPosition + (caretPosition % (bpsPerRow - 1));
    },
    'moveCaretToStartOfRow': function ({bpsPerRow, caretPosition}) {
        return caretPosition - (caretPosition % (bpsPerRow - 1));
    },
    'moveCaretToStartOfSequence': function () {
        return 0;
    },
    'moveCaretToEndOfSequence': function ({sequenceLength}) {
        return sequenceLength;
    },
}
export default handleCaretMoves;