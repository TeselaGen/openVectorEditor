// import { getRangeLength } from "ve-range-utils";
// import {  } from "ve-range-utils";
// import { normalizePositionByRangeLength } from "ve-range-utils";
// import { normalizePositionByRangeLength, getRangeLength } from "ve-range-utils";

import {
  getRangeLength,
  trimRangeByAnotherRange,
  trimNumberToFitWithin0ToAnotherNumber,
  normalizePositionByRangeLength,
  expandOrContractRangeToPosition
} from "ve-range-utils";

let draggingEnd = false;
let dragInProgress = false;
let caretPositionOnDragStart;
let selectionStartGrabbed;
let selectionEndGrabbed;

export const editorDragged = function({ nearestCaretPos }) {
  const {
    caretPosition = -1,
    selectionLayer = { start: -1, end: -1 },
    sequenceLength = this.getSequenceLength && this.getSequenceLength()
  } = this.props;

  if (!dragInProgress) {
    //we're starting the drag, so update the caret position!
    if (!selectionStartGrabbed && !selectionEndGrabbed) {
      //we're not dragging the caret or selection handles
      this.caretPositionUpdate(nearestCaretPos);
    }
    dragInProgress = true;
    return;
  }
  if (selectionStartGrabbed) {
    handleSelectionStartGrabbed({
      caretPosition,
      selectionLayer,
      selectionLayerUpdate: this.selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  } else if (selectionEndGrabbed) {
    handleSelectionEndGrabbed({
      caretPosition,
      selectionLayer,
      selectionLayerUpdate: this.selectionLayerUpdate,
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
      selectionLayerUpdate: this.selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  }
};

export const editorClicked = function({ nearestCaretPos, shiftHeld }) {
  if (!dragInProgress) {
    //we're not dragging the caret or selection handles
    this.updateSelectionOrCaret(shiftHeld, nearestCaretPos);
  }
};

export const editorDragStarted = function(opts) {
  window.__veDragging = true;
  caretPositionOnDragStart = opts.nearestCaretPos; //bump the drag counter
  selectionStartGrabbed = opts.selectionStartGrabbed;
  selectionEndGrabbed = opts.selectionEndGrabbed;
};
export const editorDragStopped = function() {
  window.__veDragging = false;
  setTimeout(function() {
    dragInProgress = false;
  });
};

export function handleCaretMoved({
  moveBy,
  circular,
  sequenceLength,
  // bpsPerRow,
  caretPosition,
  selectionLayer,
  shiftHeld,
  type,
  caretPositionUpdate,
  selectionLayerUpdate
}) {
  let newCaretPosition;
  if (selectionLayer.start > -1) {
    if (shiftHeld) {
      newCaretPosition = normalizeNewCaretPos(
        Number(
          (selectionLayer.cursorAtEnd
            ? selectionLayer.end + 1
            : selectionLayer.start) + moveBy
        ),
        sequenceLength,
        circular
      );
      // newCaretPosition = normalizeNewCaretPos(Number(caretPosition + moveBy), sequenceLength, circular);
      let anchorPos;
      if (selectionLayer.start <= selectionLayer.end) {
        //define an anchor pos
        if (selectionLayer.cursorAtEnd) {
          if (newCaretPosition === selectionLayer.start && moveBy < 0) {
            return caretPositionUpdate(newCaretPosition);
          }
          anchorPos = selectionLayer.start;
        } else {
          if (newCaretPosition === selectionLayer.end + 1 && moveBy > 0) {
            return caretPositionUpdate(newCaretPosition);
          }
          anchorPos = selectionLayer.end + 1;
        }
        if (newCaretPosition > anchorPos) {
          selectionLayerUpdate({
            start: anchorPos,
            end: newCaretPosition - 1,
            cursorAtEnd: true
          });
        } else {
          selectionLayerUpdate({
            start: newCaretPosition,
            end: anchorPos - 1,
            cursorAtEnd: false
          });
        }
      } else {
        //circular selection
        if (selectionLayer.cursorAtEnd) {
          anchorPos = selectionLayer.start;
        } else {
          anchorPos = selectionLayer.end + 1;
        }
        if (newCaretPosition <= anchorPos) {
          selectionLayerUpdate({
            start: anchorPos,
            end: newCaretPosition - 1,
            cursorAtEnd: true
          });
        } else {
          selectionLayerUpdate({
            start: newCaretPosition,
            end: anchorPos - 1,
            cursorAtEnd: false
          });
        }
      }
    } else {
      //no shiftHeld
      //handle special cases
      if (moveBy === 0) {
        if (type === "moveCaretRightOne") {
          return caretPositionUpdate(selectionLayer.end + 1);
        } else if (type === "moveCaretLeftOne") {
          return caretPositionUpdate(selectionLayer.start);
        } else {
          throw new Error("this case should not be hit...");
        }
      } else if (moveBy > 0) {
        newCaretPosition = normalizeNewCaretPos(
          Number(selectionLayer.end + moveBy),
          sequenceLength,
          circular
        );
        caretPositionUpdate(1);
      } else {
        newCaretPosition = normalizeNewCaretPos(
          Number(selectionLayer.start + moveBy),
          sequenceLength,
          circular
        );
        caretPositionUpdate(newCaretPosition);
      }
    }
  } else {
    //no selection layer
    newCaretPosition = normalizeNewCaretPos(
      Number(caretPosition + moveBy),
      sequenceLength,
      circular
    );
    if (shiftHeld) {
      if (moveBy > 0) {
        if (newCaretPosition === caretPosition) {
          caretPositionUpdate(newCaretPosition);
        } else {
          selectionLayerUpdate({
            start: caretPosition,
            end: newCaretPosition - 1,
            cursorAtEnd: true
          });
        }
      } else {
        //moving to the left
        if (newCaretPosition === caretPosition) {
          caretPositionUpdate(newCaretPosition);
        } else {
          selectionLayerUpdate({
            start: newCaretPosition,
            end: caretPosition - 1,
            cursorAtEnd: false
          });
        }
      }
    } else {
      //no shiftHeld
      caretPositionUpdate(newCaretPosition);
    }
  }
}

export function normalizeNewCaretPos(caretPosition, sequenceLength, circular) {
  if (circular) {
    return normalizePositionByRangeLength(caretPosition, sequenceLength, true);
  } else {
    return trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
  }
}

export function handleSelectionStartGrabbed({
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
export function handleNoSelectionLayerYet({
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
export function handleCaretDrag({
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

export function updateSelectionOrCaret({
  shiftHeld,
  sequenceLength,
  newRangeOrCaret,
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  caretPositionUpdate
}) {
  let newCaret;
  let newRange;
  if (typeof newRangeOrCaret !== "object") {
    newCaret = newRangeOrCaret;
  } else {
    newRange = newRangeOrCaret;
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
        });
        // if (newCaret === caretPosition) {
        //     //do nothing
        //     return
        // }
        // isRangeShorterIfFlipped(newCaret,caretPosition, sequenceLength)
        //     ? selectionLayerUpdate(caretPosition, newCaret)
        //     : selectionLayerUpdate(caretPosition, newCaret)
      } else {
        simpleUpdate();
      }
    } else if (selectionLayer.start > 0) {
      //there is already a selection layer
      if (newCaret > -1) {
        //new caret passed
        let distanceFromStart = getMinRangeLength(
          selectionLayer.start,
          newCaret,
          sequenceLength
        );
        let distanceFromEnd = getMinRangeLength(
          selectionLayer.end,
          newCaret,
          sequenceLength
        );
        if (distanceFromStart < distanceFromEnd) {
          selectionLayerUpdate({
            start: newCaret,
            end: selectionLayer.end
          });
        } else {
          selectionLayerUpdate({
            start: selectionLayer.start,
            end: normalizePositionByRangeLength(
              newCaret - 1,
              sequenceLength,
              true
            )
          });
        }
      } else {
        //new range passed
        let selectionFullyContained = !trimRangeByAnotherRange(
          selectionLayer,
          newRange
        );
        if (selectionFullyContained) {
          return selectionLayerUpdate(newRange);
        }

        let newRangeFullyContained = !trimRangeByAnotherRange(
          newRange,
          selectionLayer
        );

        let { newRange: range1 } = expandOrContractRangeToPosition(
          selectionLayer,
          newRange.start,
          sequenceLength
        );
        let { newRange: range2 } = expandOrContractRangeToPosition(
          selectionLayer,
          newRange.end + 1,
          sequenceLength
        ); //+1 to go from range end to position
        let range1Shorter = getRangeLength(range1) < getRangeLength(range2);

        if (newRangeFullyContained) {
          range1Shorter
            ? selectionLayerUpdate(range1)
            : selectionLayerUpdate(range2);
        } else {
          range1Shorter
            ? selectionLayerUpdate(range2)
            : selectionLayerUpdate(range1);
        }
      }
    } else {
      //no caret, no selection, so just do a simple update
      simpleUpdate();
    }
  } else {
    //no shift held, so just update the selection or caret
    simpleUpdate();
  }
  function simpleUpdate() {
    //shift not held, so just make a new selection layer or move the caret
    if (newCaret > -1) {
      caretPositionUpdate(newCaret);
    } else {
      selectionLayerUpdate(newRange);
    }
  }
}

// function isRangeShorterIfFlipped(start, end, sequenceLength) {
//   return !(
//     getRangeLength({ start, end }, sequenceLength) <
//     getRangeLength({ start: end, end: start }, sequenceLength)
//   );
// }

function getMinRangeLength(start, end, sequenceLength) {
  let range1 = getRangeLength({ start, end }, sequenceLength);
  let range2 = getRangeLength({ start: end, end: start }, sequenceLength);
  return range1 < range2 ? range1 : range2;
}

// export function handleNoSelectionLayerYet({
//   caretPosition,
//   selectionLayerUpdate,
//   nearestCaretPos,
//   sequenceLength
// }) {
//   //no selection layer yet, so we'll start one if necessary
//   // 0 1 2 3 4 5 6 7 8 9
//   //    c
//   //        n
//   //
//   let dragEnd = {
//     start: caretPosition,
//     end: normalizePositionByRangeLength(
//       nearestCaretPos - 1,
//       sequenceLength,
//       true
//     )
//   };
//   let dragStart = {
//     start: nearestCaretPos,
//     end: normalizePositionByRangeLength(caretPosition - 1, sequenceLength, true)
//   };
//   if (caretPosition === nearestCaretPos) {
//     return; // do nothing because nearestCaretPos === caretPosition
//   } else if (
//     getRangeLength(dragEnd, sequenceLength) <
//     getRangeLength(dragStart, sequenceLength)
//   ) {
//     selectionLayerUpdate(dragEnd);
//   } else {
//     selectionLayerUpdate(dragStart);
//   }
// }
