var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
var ac = require('ve-api-check');

export default function moveCaret({sequenceLength, selectionLayer, caretPosition, moveBy}, tree, output) {
ac.throw(ac.number, moveBy);
    if (selectionLayer.selected) {
        if (moveBy > 0) {
            tree.set('caretPosition', selectionLayer.end + 1);
        } else {
            tree.set('caretPosition', selectionLayer.start);
        }
    } else {
        caretPosition += moveBy;
        caretPosition = trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
        tree.set('caretPosition', caretPosition);
    }
}
