import { noop } from "lodash";
import {
  getRangeLength,
  trimRangeByAnotherRange,
  trimNumberToFitWithin0ToAnotherNumber,
  normalizePositionByRangeLength,
  expandOrContractRangeToPosition
} from "@teselagen/range-utils";

let dragInProgress = false;
let selectionStartOrEndGrabbed;

let caretPositionOnDragStart;
export const editorDragged = function ({
  nearestCaretPos,
  doNotWrapOrigin,
  caretPosition = -1,
  easyStore,
  caretPositionUpdate = noop,
  selectionLayerUpdate = noop,
  selectionLayer = { start: -1, end: -1 },
  sequenceLength
}) {
  if (easyStore && easyStore.selectionLayer) {
    caretPosition = easyStore.caretPosition;
    selectionLayer = easyStore.selectionLayer;
  }
  if (!dragInProgress) {
    //we're starting the drag, so update the caret position!
    dragInProgress = new Date().getTime();
    return;
  }

  if (selectionLayer.start > -1 && selectionStartOrEndGrabbed === "start") {
    handleSelectionStartGrabbed({
      caretPosition,
      selectionLayer,
      caretPositionUpdate: caretPositionUpdate,
      selectionLayerUpdate: selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength,
      doNotWrapOrigin
    });
  } else if (
    selectionLayer.start > -1 &&
    selectionStartOrEndGrabbed === "end"
  ) {
    handleSelectionEndGrabbed({
      caretPosition,
      selectionLayer,
      caretPositionUpdate: caretPositionUpdate,
      selectionLayerUpdate: selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength,
      doNotWrapOrigin
    });
  } else {
    handleNoSelectionLayerYet({
      caretPosition: caretPositionOnDragStart,
      selectionLayer: caretPositionOnDragStart
        ? { start: -1, end: -1 }
        : selectionLayer,
      selectionLayerUpdate: selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength,
      doNotWrapOrigin
    });
  }
};

export const editorClicked = function ({
  nearestCaretPos,
  shiftHeld,
  updateSelectionOrCaret
}) {
  const timeDif = new Date().getTime() - dragInProgress;
  if (!dragInProgress || 200 > timeDif) {
    //if the drag is less than 200 ms it probably isn't a real drag!
    //we're not dragging the caret or selection handles
    updateSelectionOrCaret(shiftHeld, nearestCaretPos);
  }
};

export const editorDragStarted = function (opts) {
  document?.body.classList.add("sequenceDragging"); //needed to prevent the input bubble from losing focus post user drag
  window.__veDragging = true;

  caretPositionOnDragStart = opts.nearestCaretPos; //bump the drag counter
  selectionStartOrEndGrabbed = opts.selectionStartGrabbed
    ? "start"
    : opts.selectionEndGrabbed
    ? "end"
    : null;
};
export const editorDragStopped = function () {
  document.body.classList.remove("sequenceDragging"); //needed to prevent the input bubble from losing focus post user drag
  window.__veDragging = false;
  caretPositionOnDragStart = null;
  setTimeout(function () {
    dragInProgress = false;
  });
};

export function handleCaretMoved({
  moveBy,
  circular,
  sequenceLength,
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
        //non-circular selection
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
          if (circular && selectionLayer.start + moveBy < 0) {
            //we've gone around the origin in this case
            selectionLayerUpdate({
              start: newCaretPosition,
              end: anchorPos - 1,
              cursorAtEnd: false
            });
          } else {
            selectionLayerUpdate({
              start: anchorPos,
              end: normalizePositionByRangeLength(
                newCaretPosition - 1,
                sequenceLength
              ),
              cursorAtEnd: true
            });
          }
        } else {
          if (circular && selectionLayer.end + moveBy >= sequenceLength) {
            //we've gone around the origin in this case
            selectionLayerUpdate({
              start: anchorPos,
              end: normalizePositionByRangeLength(
                newCaretPosition - 1,
                sequenceLength
              ),
              cursorAtEnd: true
            });
          } else {
            selectionLayerUpdate({
              start: newCaretPosition,
              end: normalizePositionByRangeLength(
                anchorPos - 1,
                sequenceLength
              ),
              cursorAtEnd: false
            });
          }
        }
      } else {
        //circular selection
        if (selectionLayer.cursorAtEnd) {
          anchorPos = selectionLayer.start;
        } else {
          anchorPos = selectionLayer.end + 1;
        }

        if (
          (newCaretPosition <= anchorPos &&
            !(!selectionLayer.cursorAtEnd && newCaretPosition - moveBy < 0)) || // if the move by is crossing the origin then we should make the new selection non circular
          (selectionLayer.cursorAtEnd && selectionLayer.end + moveBy < 0)
        ) {
          selectionLayerUpdate({
            start: anchorPos,
            end: normalizePositionByRangeLength(
              newCaretPosition - 1,
              sequenceLength
            ),
            cursorAtEnd: true
          });
        } else {
          selectionLayerUpdate({
            start: normalizePositionByRangeLength(
              newCaretPosition,
              sequenceLength
            ),
            end: normalizePositionByRangeLength(anchorPos - 1, sequenceLength),
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
            end: normalizePositionByRangeLength(
              newCaretPosition - 1,
              sequenceLength
            ),
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
            end: normalizePositionByRangeLength(
              caretPosition - 1,
              sequenceLength
            ),
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
  sequenceLength,
  doNotWrapOrigin,
  caretPositionUpdate
}) {
  if (selectionLayer.start < 0) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayer,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength,
      doNotWrapOrigin
    });
  } else {
    if (
      doNotWrapOrigin &&
      selectionLayer.end > -1 &&
      nearestCaretPos === selectionLayer.end + 1
    ) {
      caretPositionUpdate(nearestCaretPos);
      caretPositionOnDragStart = nearestCaretPos;
    } else if (doNotWrapOrigin && nearestCaretPos > selectionLayer.end + 1) {
      caretPositionOnDragStart = selectionLayer.end + 1;
      selectionLayerUpdate({
        start: selectionLayer.end + 1,
        end: nearestCaretPos
      });
      selectionStartOrEndGrabbed = "end";
    } else {
      selectionStartOrEndGrabbed = "start";
      //there must be a selection layer
      //we need to move the selection layer
      selectionLayerUpdate({
        start: nearestCaretPos,
        end: selectionLayer.end
      });
    }
  }
}

export function handleSelectionEndGrabbed({
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength,
  doNotWrapOrigin,
  caretPositionUpdate
}) {
  if (selectionLayer.start < 0) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength,
      doNotWrapOrigin
    });
  } else {
    if (
      doNotWrapOrigin &&
      selectionLayer.start > -1 &&
      nearestCaretPos === selectionLayer.start
    ) {
      caretPositionUpdate(nearestCaretPos);
      caretPositionOnDragStart = nearestCaretPos;
    } else if (doNotWrapOrigin && nearestCaretPos < selectionLayer.start) {
      selectionLayerUpdate({
        start: nearestCaretPos,
        end: selectionLayer.start - 1
      });
      caretPositionOnDragStart = selectionLayer.start;
      selectionStartOrEndGrabbed = "start";
    } else {
      selectionStartOrEndGrabbed = "end";
      //there must be a selection layer
      //we need to move the selection layer
      const newEnd = Math.min(nearestCaretPos - 1, sequenceLength - 1);
      selectionLayerUpdate({
        start: selectionLayer.start,
        end: newEnd,
        cursorAtEnd: true
      });
    }
  }
}
export function handleNoSelectionLayerYet({
  caretPosition,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength,
  doNotWrapOrigin
}) {
  //no selection layer yet, so we'll start one if necessary
  // 0 1 2 3 4 5 6 7 8 9
  //    c
  //        n
  //

  const dragEnd = {
    start: caretPosition,
    end: normalizePositionByRangeLength(
      nearestCaretPos - 1,
      sequenceLength,
      true
    )
  };
  const dragStart = {
    start: nearestCaretPos,
    end: normalizePositionByRangeLength(caretPosition - 1, sequenceLength, true)
  };
  if (caretPosition === nearestCaretPos) {
    return; // do nothing because nearestCaretPos === caretPosition
  } else if (
    (doNotWrapOrigin && caretPosition < nearestCaretPos) ||
    (!doNotWrapOrigin &&
      getRangeLength(dragEnd, sequenceLength) <
        getRangeLength(dragStart, sequenceLength))
  ) {
    selectionStartOrEndGrabbed = "end";
    selectionLayerUpdate(dragEnd);
    caretPositionOnDragStart = null;
  } else {
    selectionStartOrEndGrabbed = "start";
    selectionLayerUpdate(dragStart);
    caretPositionOnDragStart = null;
  }
}

export function updateSelectionOrCaret({
  shiftHeld,
  sequenceLength,
  newRangeOrCaret,
  caretPosition,
  selectionLayer,
  selectionLayerUpdate = noop,
  caretPositionUpdate = noop,
  doNotWrapOrigin
}) {
  let newCaret;
  let newRange;
  if (typeof newRangeOrCaret !== "object") {
    newCaret = newRangeOrCaret;
  } else {
    newRange = {
      isFromRowView: newRangeOrCaret.isFromRowView,
      start: newRangeOrCaret.start,
      end: newRangeOrCaret.end,
      forward: newRangeOrCaret.forward,
      forceUpdate: newRangeOrCaret.forceUpdate,
      overlapsSelf: newRangeOrCaret.overlapsSelf,
      isWrappedAddon: newRangeOrCaret.isWrappedAddon
    };
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
          sequenceLength,
          doNotWrapOrigin
        });
      } else {
        simpleUpdate();
      }
    } else if (selectionLayer.start > -1) {
      //there is already a selection layer
      if (newCaret > -1) {
        //new caret passed
        const distanceFromStart = getMinRangeLength(
          selectionLayer.start,
          newCaret,
          sequenceLength,
          doNotWrapOrigin
        );
        const distanceFromEnd = getMinRangeLength(
          selectionLayer.end,
          newCaret,
          sequenceLength,
          doNotWrapOrigin
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
        // return selectionLayerUpdate(newRange);
        const selectionFullyContained = !trimRangeByAnotherRange(
          selectionLayer,
          newRange
        );
        if (selectionFullyContained) {
          return selectionLayerUpdate(newRange);
        }

        const newRangeFullyContained = !trimRangeByAnotherRange(
          newRange,
          selectionLayer
        );

        const { newRange: range1 } = expandOrContractRangeToPosition(
          selectionLayer,
          newRange.start,
          sequenceLength
        );
        const { newRange: range2 } = expandOrContractRangeToPosition(
          selectionLayer,
          newRange.end + 1,
          sequenceLength
        ); //+1 to go from range end to position
        const range1Shorter =
          getRangeLength(range1, sequenceLength) <
          getRangeLength(range2, sequenceLength);

        if (newRangeFullyContained) {
          range1Shorter
            ? selectionLayerUpdate(range1)
            : selectionLayerUpdate(range2);
        } else {
          selectionLayerUpdate({
            forward: newRange.forward,
            start: selectionLayer.start,
            end: newRange.end
          });
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

function getMinRangeLength(start, end, sequenceLength, doNotWrapOrigin) {
  const range1 = getRangeLength({ start, end }, sequenceLength);
  const range2 = getRangeLength({ start: end, end: start }, sequenceLength);
  if (doNotWrapOrigin) {
    if (start < end) {
      return range1;
    } else {
      return range2;
    }
  }
  return range1 < range2 ? range1 : range2;
}
