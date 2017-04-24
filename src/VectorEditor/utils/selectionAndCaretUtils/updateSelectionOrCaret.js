import getRangeLength from 've-range-utils/getRangeLength';
import checkIfPotentiallyCircularRangesOverlap from 've-range-utils/checkIfPotentiallyCircularRangesOverlap';
import expandOrContractRangeToPosition from 've-range-utils/expandOrContractRangeToPosition';
import trimRangeByAnotherRange from 've-range-utils/trimRangeByAnotherRange';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import handleNoSelectionLayerYet from './handleNoSelectionLayerYet';

export default function updateSelectionOrCaret({shiftHeld, sequenceLength, newRangeOrCaret, caretPosition, selectionLayer, selectionLayerUpdate, caretPositionUpdate}) {
    var newCaret
    var newRange
    if (typeof newRangeOrCaret !== 'object') {
        newCaret = newRangeOrCaret
    } else {
        newRange = newRangeOrCaret
    }
    if (shiftHeld) {
        if (caretPosition > 0) {
            //there is a caret already down
            if (newCaret > -1) {
                //a new caret is being passed
                handleNoSelectionLayerYet({
                    caretPosition,
                    selectionLayer,
                    selectionLayerUpdate,
                    nearestCaretPos: newCaret,
                    sequenceLength
                })
                // if (newCaret === caretPosition) {
                //     //do nothing
                //     return 
                // }
                // isRangeShorterIfFlipped(newCaret,caretPosition, sequenceLength)
                //     ? selectionLayerUpdate(caretPosition, newCaret)
                //     : selectionLayerUpdate(caretPosition, newCaret)
            } else {
                simpleUpdate()
            }
        } else if (selectionLayer.start > 0) {
            //there is already a selection layer
            if (newCaret > -1) {
                //new caret passed
                var distanceFromStart = getMinRangeLength(selectionLayer.start, newCaret, sequenceLength)
                var distanceFromEnd = getMinRangeLength(selectionLayer.end, newCaret, sequenceLength)
                if (distanceFromStart < distanceFromEnd) {
                    selectionLayerUpdate({
                        start: newCaret,
                        end: selectionLayer.end
                    })
                } else {
                    selectionLayerUpdate({
                        start: selectionLayer.start,
                        end: normalizePositionByRangeLength(newCaret - 1, sequenceLength, true)
                    })
                }
            } else {
                //new range passed
                var selectionFullyContained = !trimRangeByAnotherRange(selectionLayer, newRange)
                if (selectionFullyContained) {
                    return selectionLayerUpdate(newRange)
                }

                var newRangeFullyContained = !trimRangeByAnotherRange(newRange, selectionLayer)
                
                var {newRange: range1} = expandOrContractRangeToPosition(selectionLayer, newRange.start, sequenceLength)
                var {newRange: range2} = expandOrContractRangeToPosition(selectionLayer, newRange.end + 1, sequenceLength) //+1 to go from range end to position 
                var range1Shorter = getRangeLength(range1) < getRangeLength(range2)

                if (newRangeFullyContained) {
                    range1Shorter 
                        ? selectionLayerUpdate(range1)
                        : selectionLayerUpdate(range2)
                } else {
                    range1Shorter 
                        ? selectionLayerUpdate(range2)
                        : selectionLayerUpdate(range1)
                }
            }
        } else {
            //no caret, no selection, so just do a simple update
            simpleUpdate()
        }
        
    } else {
        //no shift held, so just update the selection or caret
        simpleUpdate()
    }
    function simpleUpdate() {
        //shift not held, so just make a new selection layer or move the caret
        if (newCaret > -1) {
            caretPositionUpdate(newCaret)
        } else {
            selectionLayerUpdate(newRange)
        }
    }
}

function isRangeShorterIfFlipped(start, end, sequenceLength) {
    return (getRangeLength({start, end}, sequenceLength) 
        < getRangeLength({start: end, end: start}, sequenceLength))
        ? false
        : true
}

function getMinRangeLength(start, end, sequenceLength) {
    var range1 = getRangeLength({start, end}, sequenceLength)
    var range2 = getRangeLength({start: end, end: start}, sequenceLength)
    return range1 < range2
        ? range1
        : range2
}
