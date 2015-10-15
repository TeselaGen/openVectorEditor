var expandOrContractNonCircularRangeToPosition = require('ve-range-utils/expandOrContractNonCircularRangeToPosition');
var expandOrContractCircularRangeToPosition = require('ve-range-utils/expandOrContractCircularRangeToPosition');
var ac = require('ve-api-check');
export default function updateSelectionShiftClick({updatedCaretPos, sequenceLength, caretPosition, selectionLayer}, tree, output) {
    if (selectionLayer.start > selectionLayer.end) {
        var {newRange, endMoved} = expandOrContractCircularRangeToPosition(selectionLayer, updatedCaretPos, sequenceLength);
        newRange.cursorAtEnd = endMoved;
        output({selectionLayer: newRange})
    } else {
        /*eslint-disable no-redeclare*/
        var {newRange, endMoved} = expandOrContractNonCircularRangeToPosition(selectionLayer, updatedCaretPos);
        /*eslint-enable no-redeclare*/
        newRange.cursorAtEnd = endMoved;
        output({selectionLayer: newRange})
    }
}
