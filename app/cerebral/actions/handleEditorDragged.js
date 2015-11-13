// var trimNumberToFitWithin0ToAnotherNumber = require('ve-range-utils/trimNumberToFitWithin0ToAnotherNumber');
// var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
// var ac = require('ve-api-check');
export default function handleEditorDragged({
    nearestBP,
}, tree, output) {
    var {
        sequenceLength, caretPosition, selectionLayer, sequenceData: {
            circular
        }, editorDrag: {fixedCaretPositionOnDragStart, fixedCaretPositionOnDragStartType}
    } = tree.get();
    tree.set(['editorDrag', 'inProgress'], true)
    if (nearestBP === fixedCaretPositionOnDragStart) {
        output.caretMoved({
            caretPosition: fixedCaretPositionOnDragStart
        });
    } else {
        var newSelectionLayer;
        if (fixedCaretPositionOnDragStartType === 'start') {
            newSelectionLayer = {
                start: fixedCaretPositionOnDragStart,
                end: nearestBP - 1,
                cursorAtEnd: true,
            };
        } else if (fixedCaretPositionOnDragStartType === 'end') {
            newSelectionLayer = {
                start: nearestBP,
                end: fixedCaretPositionOnDragStart - 1,
                cursorAtEnd: false,
            };
        } else {
            if (nearestBP > fixedCaretPositionOnDragStart) {
                newSelectionLayer = {
                    start: fixedCaretPositionOnDragStart,
                    end: nearestBP - 1,
                    cursorAtEnd: true,
                };
            } else {
                newSelectionLayer = {
                    start: nearestBP,
                    end: fixedCaretPositionOnDragStart - 1,
                    cursorAtEnd: false,
                };
            }
        }
        output.selectionUpdated({
            selectionLayer: newSelectionLayer
        });
    }


    // if (editorDrag.initiatedByGrabbingCaret) {

    // } else {

    // }
    // if (editorDrag.positionOfFixedCaretPosition === nearestBP) {
    //     if (selectionLayer.selected && getRangeLength(selectionLayer, sequenceLength) >= sequenceLength - 1) {
    //         output.selectionUpdated({
    //             selectionLayer: {
    //                 start: 1
    //             }
    //         });
    //     } else {
    //         output.caretMoved({
    //             caretPosition: editorDrag.positionOfFixedCaretPosition
    //         });
    //     }
    // } else {

    // }
    // // if (selectionLayer.selected && selectionLayer.start ) 

    // //note this method relies on variables that are set in the handleEditorDragStart method!
    // editorBeingDragged = true;
    // console.log('nearestBP: ' + JSON.stringify(nearestBP, null, 4));
}

handleEditorDragged.outputs = ['caretMoved', 'selectionUpdated'];