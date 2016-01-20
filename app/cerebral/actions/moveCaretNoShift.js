var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');

export default function moveCaret({input: {sequenceLength, selectionLayer, caretPosition, moveBy}, state, output}) {
    ac.throw(ac.number, moveBy);
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
