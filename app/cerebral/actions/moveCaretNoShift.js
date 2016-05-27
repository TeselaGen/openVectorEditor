var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');

export default function moveCaret({input: {sequenceLength, selectionLayer, caretPosition, moveBy}, state, output}) {
    if (selectionLayer.selected) {
        if (moveBy > 0) {
            state.set('caretPosition', selectionLayer.end + 1);
        } else {
            state.set('caretPosition', selectionLayer.start);
        }
    } else {
        caretPosition += moveBy;
        caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
        state.set('caretPosition', caretPosition);
    }
}
