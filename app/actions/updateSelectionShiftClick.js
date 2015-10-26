import expandOrContractNonCircularRangeToPosition from 've-range-utils/expandOrContractNonCircularRangeToPosition';
import expandOrContractCircularRangeToPosition from 've-range-utils/expandOrContractCircularRangeToPosition';
import ac from 've-api-check';
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
