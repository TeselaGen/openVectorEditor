import updateSelectionOrCaret from '../utils/selectionAndCaretUtils/updateSelectionOrCaret';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getRangeLength from 've-range-utils/getRangeLength';
import React from 'react'
import { draggableClassNames } from '../CircularView';

var draggingEnd = false;
var dragInProgress = false
var caretPositionOnDragStart;
var classNameOfDraggedElement;
class VectorInteractionWrapper extends React.Component {
    static childContextTypes = {
        namespace: React.PropTypes.string
    }
    getChildContext() {
        return {
            namespace: this.props.namespace
        }
    }
    render() {
        var {

            caretPosition, 
            selectionLayer, 
            sequenceData, 
            namespace, 
        } = this.props
        //do this in two steps to determine the props to pass
        var {
            children, 
            key,
            ref,
            disableEditorClickAndDrag=false,
            ...propsToPass
        } = this.props;
        const updateSelectionLayer = ({start, end}) => {
            if (selectionLayer.start === start && selectionLayer.end === end) {
                return
            }
            //we only call updateSelectionLayer if we're actually changing something
            this.props.updateSelectionLayer({
                start,
                end
            }, namespace)
        }
        const updateCaret = (position) => {
            if (caretPosition === position) {
                return
            }
            //we only call updateCaret if we're actually changing something
            this.props.updateCaret(position, namespace)
        }

        var sequenceLength = sequenceData.sequence.length;

        if (!disableEditorClickAndDrag) {
            propsToPass = {
                ...propsToPass,
                editorDragged: function({nearestCaretPos}) {
                    // //console.log('editorDragged');
                    if (!dragInProgress) {
                        //we're starting the drag, so update the caret position!
                        if (!draggableClassNames[classNameOfDraggedElement]) {
                            // //console.log('UPDATE CARET');
                            //we're not dragging the caret or selection handles
                            updateCaret(nearestCaretPos)
                        }
                        dragInProgress = true
                        return
                    }

                    switch (classNameOfDraggedElement) {
                    case draggableClassNames.selectionStart:
                        // //console.log('SELECTION START GRABBED');
                        handleSelectionStartGrabbed({
                            caretPosition,
                            selectionLayer,
                            updateSelectionLayer,
                            nearestCaretPos,
                            sequenceLength
                        })
                        break;
                    case draggableClassNames.selectionEnd:
                        // //console.log('SELECTION END GRABBED');
                        handleSelectionEndGrabbed({
                            caretPosition,
                            selectionLayer,
                            updateSelectionLayer,
                            nearestCaretPos,
                            sequenceLength
                        })
                        break;
                    case draggableClassNames.caretSVG:
                        //pass the current caret position
                        handleCaretDrag({
                            caretPosition,
                            selectionLayer,
                            updateSelectionLayer,
                            nearestCaretPos,
                            sequenceLength
                        })
                        break;
                    default:

                        //dragging somewhere within the sequence
                        //pass the caret position of the drag start
                        handleCaretDrag({
                            caretPosition: caretPositionOnDragStart,
                            selectionLayer,
                            updateSelectionLayer,
                            nearestCaretPos,
                            sequenceLength
                        })
                        break;
                    }
                },
                editorDragStarted: function({nearestCaretPos, className}) {
                    // //console.log('dragStarted');
                    // //console.log('nearestCaretPos: ' + JSON.stringify(nearestCaretPos,null,4));
                    caretPositionOnDragStart = nearestCaretPos //bump the drag counter
                    classNameOfDraggedElement = className;
                },
                editorClicked: function({nearestCaretPos, className, shiftHeld}) {
                    // //console.log('editorClicked');
                    // //console.log('nearestCaretPos: ' + JSON.stringify(nearestCaretPos,null,4));
                    if (!dragInProgress) {
                        //we're not dragging the caret or selection handles
                        updateSelectionOrCaret({shiftHeld, sequenceLength, newRangeOrCaret: nearestCaretPos, caretPosition, selectionLayer, updateSelectionLayer, updateCaret})
                    }
                },
                editorDragStopped: function(argument) {
                    setTimeout(function(argument) {
                        dragInProgress = false
                    })
                },
            }
        }

        return React.cloneElement(children, propsToPass)
    }
}

export default VectorInteractionWrapper



function handleSelectionStartGrabbed({caretPosition, selectionLayer, updateSelectionLayer, nearestCaretPos, sequenceLength}) {
    if (selectionLayer.start < 0) {
        handleNoSelectionLayerYet({
            caretPosition,
            selectionLayer,
            updateSelectionLayer,
            nearestCaretPos,
            sequenceLength
        })
    } else {
        //there must be a selection layer
        //we need to move the selection layer
        updateSelectionLayer({
            start: nearestCaretPos,
            end: selectionLayer.end
        })
    }
}
function handleSelectionEndGrabbed({caretPosition, selectionLayer, updateSelectionLayer, nearestCaretPos, sequenceLength}) {
    if (selectionLayer.start < 0) {
        handleNoSelectionLayerYet({
            caretPosition,
            updateSelectionLayer,
            nearestCaretPos,
            sequenceLength
        })
    } else {
        //there must be a selection layer                  
        //we need to move the selection layer
        var newEnd = normalizePositionByRangeLength(nearestCaretPos - 1, sequenceLength)
        updateSelectionLayer({
            start: selectionLayer.start,
            end: newEnd
        })
    }
}
function handleNoSelectionLayerYet({caretPosition, updateSelectionLayer, nearestCaretPos, sequenceLength}) {
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
        draggingEnd = true; //the caret becomes the "selection end"
        updateSelectionLayer(dragEnd)
    } else {
        draggingEnd = false; //the caret becomes the "selection end"
        updateSelectionLayer(dragStart)
    }
}
function handleCaretDrag({caretPosition, selectionLayer, updateSelectionLayer, nearestCaretPos, sequenceLength}) {
    // //console.log('handleCaretDrag');
    if (selectionLayer.start > -1) {
        //there is a selection layer
        draggingEnd ? handleSelectionEndGrabbed({
            caretPosition,
            selectionLayer,
            updateSelectionLayer,
            nearestCaretPos,
            sequenceLength
        }) : handleSelectionStartGrabbed({
            caretPosition,
            selectionLayer,
            updateSelectionLayer,
            nearestCaretPos,
            sequenceLength
        })
    } else if (caretPosition > -1) {
        handleNoSelectionLayerYet({
            caretPosition,
            selectionLayer,
            updateSelectionLayer,
            nearestCaretPos,
            sequenceLength
        })
    } else {
        console.warn('we should never be here...')
        debugger;
    }
}
