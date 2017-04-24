import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getRangeLength from 've-range-utils/getRangeLength';
export default function handleNoSelectionLayerYet({caretPosition, selectionLayerUpdate, nearestCaretPos, sequenceLength}) {
    //no selection layer yet, so we'll start one if necessary
    // 0 1 2 3 4 5 6 7 8 9
    //    c 
    //        n 
    //
    var dragEnd = {
        start: caretPosition,
        end: normalizePositionByRangeLength(nearestCaretPos - 1, sequenceLength, true)
    }
    var dragStart = {
        start: nearestCaretPos,
        end: normalizePositionByRangeLength(caretPosition - 1, sequenceLength, true)
    }
    if (caretPosition === nearestCaretPos) {
        return // do nothing because nearestCaretPos === caretPosition
    } else if (getRangeLength(dragEnd, sequenceLength) < getRangeLength(dragStart, sequenceLength)) {
        selectionLayerUpdate(dragEnd)
    } else {
        selectionLayerUpdate(dragStart)
    }
}