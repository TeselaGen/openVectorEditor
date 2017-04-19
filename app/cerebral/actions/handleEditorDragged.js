var normalizePositionByRangeLength = require('ve-range-utils/normalizePositionByRangeLength');
var getRangeLength = require('ve-range-utils/getRangeLength');

export default function handleEditorDragged({input: {
    nearestBP, resize
}, state, output}) {
    var {
        sequenceLength, caretPosition, selectionLayer, sequenceData: {
            circular
        }, editorDrag: {fixedCaretPositionOnDragStart, fixedCaretPositionOnDragStartType}
    } = state.get();
    state.set(['editorDrag', 'inProgress'], true)
    if (nearestBP === fixedCaretPositionOnDragStart && (!selectionLayer.selected || selectionLayer.start < selectionLayer.end)) {
        output.caretMoved({
            caretPosition: fixedCaretPositionOnDragStart
        });
    } else {
        var newSelectionLayer;
        if (fixedCaretPositionOnDragStartType === 'start' && circular) {
            newSelectionLayer = {
                start: fixedCaretPositionOnDragStart,
                end: normalizePositionByRangeLength(nearestBP - 1, sequenceLength, true),
                cursorAtEnd: true,
            };
        } else if (fixedCaretPositionOnDragStartType === 'end' && circular) {
            newSelectionLayer = {
                start: nearestBP,
                end: normalizePositionByRangeLength(fixedCaretPositionOnDragStart - 1, sequenceLength, true),
                cursorAtEnd: false,
            };
        } else {
                if (nearestBP > fixedCaretPositionOnDragStart) {
                    newSelectionLayer = {
                        start: fixedCaretPositionOnDragStart,
                        end: nearestBP - 1,
                        cursorAtEnd: true,
                    };
                    state.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'start')
                } else {
                    newSelectionLayer = {
                        start: nearestBP,
                        end: fixedCaretPositionOnDragStart - 1,
                        cursorAtEnd: false,
                    };
                    state.set(['editorDrag', 'fixedCaretPositionOnDragStartType'], 'end')
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
