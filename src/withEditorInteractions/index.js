import getSequenceWithinRange from "ve-range-utils/getSequenceWithinRange";
import { compose } from "redux";
import Keyboard from "./Keyboard";

import withEditorProps from "../withEditorProps";
import updateSelectionOrCaret from "../utils/selectionAndCaretUtils/updateSelectionOrCaret";
import AddOrEditFeatureDialog from "../helperComponents/AddOrEditFeatureDialog";
import normalizePositionByRangeLength from "ve-range-utils/normalizePositionByRangeLength";
import getRangeLength from "ve-range-utils/getRangeLength";
import React from "react";
import createSequenceInputPopup from "./createSequenceInputPopup";

// import draggableClassnames from "../constants/draggableClassnames";

function noop() {}
let draggingEnd = false;
let dragInProgress = false;
let caretPositionOnDragStart;
let selectionStartGrabbed;
let selectionEndGrabbed;

function VectorInteractionHOC(Component) {
  return class VectorInteractionWrapper extends React.Component {
    handlePaste(/* event */) {
      //tnr: commenting paste handling out for the time being
      // var {
      //     handlePaste=noop,
      // } = this.props
      // event.clipboardData.items[0].getAsString(function(clipboardString) {
      //     handlePaste({sequenceString:clipboardString});
      // });
    }

    render() {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        onCopy = noop,
        readOnly
      } = this.props;
      //do this in two steps to determine propsToPass
      let {
        children,
        disableEditorClickAndDrag = false,
        ...propsToPass
      } = this.props;
      let selectedBps = getSequenceWithinRange(
        selectionLayer,
        sequenceData.sequence
      );

      function onDnaInsert() {
        !readOnly &&
          createSequenceInputPopup({
            isReplace: selectionLayer.start > -1,
            selectionLayer,
            sequenceLength,
            caretPosition,
            replacementLayerUpdate: () => {}
          });
      }

      const selectionLayerUpdate = newSelection => {
        if (!newSelection) return;
        const { start, end } = newSelection;
        if (selectionLayer.start === start && selectionLayer.end === end) {
          return;
        }
        //we only call selectionLayerUpdate if we're actually changing something
        this.props.selectionLayerUpdate({
          start,
          end
        });
      };
      const caretPositionUpdate = position => {
        if (caretPosition === position) {
          return;
        }
        //we only call caretPositionUpdate if we're actually changing something
        this.props.caretPositionUpdate(position);
      };

      let sequenceLength = sequenceData.sequence.length;

      if (!disableEditorClickAndDrag) {
        propsToPass = {
          ...propsToPass,
          editorDragged: function({ nearestCaretPos }) {
            if (!dragInProgress) {
              //we're starting the drag, so update the caret position!
              if (!selectionStartGrabbed && !selectionEndGrabbed) {
                //we're not dragging the caret or selection handles
                caretPositionUpdate(nearestCaretPos);
              }
              dragInProgress = true;
              return;
            }
            if (selectionStartGrabbed) {
              handleSelectionStartGrabbed({
                caretPosition,
                selectionLayer,
                selectionLayerUpdate,
                nearestCaretPos,
                sequenceLength
              });
            } else if (selectionEndGrabbed) {
              handleSelectionEndGrabbed({
                caretPosition,
                selectionLayer,
                selectionLayerUpdate,
                nearestCaretPos,
                sequenceLength
              });
            } else {
              // else if (caretGrabbed) {
              //     handleCaretDrag({
              //         caretPosition,
              //         selectionLayer,
              //         selectionLayerUpdate,
              //         nearestCaretPos,
              //         sequenceLength
              //     })
              // }
              //dragging somewhere within the sequence
              //pass the caret position of the drag start
              handleCaretDrag({
                caretPosition: caretPositionOnDragStart,
                selectionLayer,
                selectionLayerUpdate,
                nearestCaretPos,
                sequenceLength
              });
            }
          },
          editorDragStarted: function(opts) {
            caretPositionOnDragStart = opts.nearestCaretPos; //bump the drag counter
            selectionStartGrabbed = opts.selectionStartGrabbed;
            selectionEndGrabbed = opts.selectionEndGrabbed;
          },
          editorClicked: function({ nearestCaretPos, shiftHeld }) {
            if (!dragInProgress) {
              //we're not dragging the caret or selection handles
              updateSelectionOrCaret({
                shiftHeld,
                sequenceLength,
                newRangeOrCaret: nearestCaretPos,
                caretPosition,
                selectionLayer,
                selectionLayerUpdate,
                caretPositionUpdate
              });
            }
          },
          editorDragStopped: function() {
            setTimeout(function() {
              dragInProgress = false;
            });
          }
        };
      }
      return (
        <div
          ref={c => (this.veVectorInteractionWrapper = c)}
          className={"veVectorInteractionWrapper"}
        >
          <Keyboard
            value={selectedBps}
            onDnaInsert={onDnaInsert}
            onCopy={e => {
              onCopy(e, sequenceData, this.props);
            }}
            onPaste={this.handlePaste.bind(this)}
          />
          <AddOrEditFeatureDialog
            dialogName="AddOrEditFeatureDialog"
            noTarget
          />{" "}
          {/* we pass this dialog here */}
          <Component veWrapperProvidedProps={propsToPass} />
        </div>
      );
    }
  };
}

function handleSelectionStartGrabbed({
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  if (selectionLayer.start < 0) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayer,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  } else {
    //there must be a selection layer
    //we need to move the selection layer
    selectionLayerUpdate({
      start: nearestCaretPos,
      end: selectionLayer.end
    });
  }
}
function handleSelectionEndGrabbed({
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  if (selectionLayer.start < 0) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  } else {
    //there must be a selection layer
    //we need to move the selection layer
    let newEnd = normalizePositionByRangeLength(
      nearestCaretPos - 1,
      sequenceLength
    );
    selectionLayerUpdate({
      start: selectionLayer.start,
      end: newEnd
    });
  }
}
function handleNoSelectionLayerYet({
  caretPosition,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  //no selection layer yet, so we'll start one if necessary
  // 0 1 2 3 4 5 6 7 8 9
  //    c
  //        n
  //
  let dragEnd = {
    start: caretPosition,
    end: normalizePositionByRangeLength(
      nearestCaretPos - 1,
      sequenceLength,
      true
    )
  };
  let dragStart = {
    start: nearestCaretPos,
    end: normalizePositionByRangeLength(caretPosition - 1, sequenceLength, true)
  };
  if (caretPosition === nearestCaretPos) {
    return; // do nothing because nearestCaretPos === caretPosition
  } else if (
    getRangeLength(dragEnd, sequenceLength) <
    getRangeLength(dragStart, sequenceLength)
  ) {
    draggingEnd = true; //the caret becomes the "selection end"
    selectionLayerUpdate(dragEnd);
  } else {
    draggingEnd = false; //the caret becomes the "selection end"
    selectionLayerUpdate(dragStart);
  }
}
function handleCaretDrag({
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  if (selectionLayer.start > -1) {
    //there is a selection layer
    draggingEnd
      ? handleSelectionEndGrabbed({
          caretPosition,
          selectionLayer,
          selectionLayerUpdate,
          nearestCaretPos,
          sequenceLength
        })
      : handleSelectionStartGrabbed({
          caretPosition,
          selectionLayer,
          selectionLayerUpdate,
          nearestCaretPos,
          sequenceLength
        });
  } else if (caretPosition > -1) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayer,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  } else {
    console.warn("we should never be here...");
  }
}

export default compose(withEditorProps, VectorInteractionHOC);
