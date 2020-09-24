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

// let draggingEnd = false;
let dragInProgress = false;
let selectionStartOrEndGrabbed;

let caretPositionOnDragStart;
export const editorDragged = function ({ nearestCaretPos, doNotWrapOrigin }) {
  let {
    caretPosition = -1,
    selectionLayer = { start: -1, end: -1 },
    sequenceLength = this.getSequenceLength && this.getSequenceLength()
  } = this.props;

  if (this.easyStore && this.easyStore.selectionLayer) {
    caretPosition = this.easyStore.caretPosition;
    selectionLayer = this.easyStore.selectionLayer;
  }
  if (!dragInProgress) {
    //we're starting the drag, so update the caret position!
    if (!selectionStartOrEndGrabbed) {
      //we're not dragging the caret or selection handles
      // caretPositionOnDragStart = nearestCaretPos;
      // this.caretPositionUpdate(nearestCaretPos);
    }
    dragInProgress = new Date().getTime();
    return;
  }

  if (selectionLayer.start > -1 && selectionStartOrEndGrabbed === "start") {
    handleSelectionStartGrabbed({
      caretPosition,
      selectionLayer,
      caretPositionUpdate: this.caretPositionUpdate,
      selectionLayerUpdate: this.selectionLayerUpdate,
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
      caretPositionUpdate: this.caretPositionUpdate,
      selectionLayerUpdate: this.selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength,
      doNotWrapOrigin
    });
  } else {
    // } else if (caretPosition > -1) {
    handleNoSelectionLayerYet({
      caretPosition: caretPositionOnDragStart,
      selectionLayer: caretPositionOnDragStart
        ? { start: -1, end: -1 }
        : selectionLayer,
      selectionLayerUpdate: this.selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength,
      doNotWrapOrigin
    });
  }
  // else {
  //   debugger;
  //   console.warn("we should never be here...");
  // }
};

export const editorClicked = function ({ nearestCaretPos, shiftHeld }) {
  const timeDif = new Date().getTime() - dragInProgress;
  if (!dragInProgress || 200 > timeDif) {
    //if the drag is less than 200 ms it probably isn't a real drag!
    //we're not dragging the caret or selection handles
    this.updateSelectionOrCaret(shiftHeld, nearestCaretPos);
  }
};

export const editorDragStarted = function (opts) {
  document.body.classList.add("sequenceDragging"); //needed to prevent the input bubble from losing focus post user drag
  window.__veDragging = true;

  caretPositionOnDragStart = opts.nearestCaretPos; //bump the drag counter
  selectionStartOrEndGrabbed = opts.selectionStartGrabbed
    ? "start"
    : opts.selectionEndGrabbed
    ? "end"
    : null;

  // let styleEl = document.getElementById("react-draggable-style-el");
  // if (!styleEl) {
  //   styleEl = document.createElement("style");
  //   styleEl.type = "text/css";
  //   styleEl.id = "react-draggable-style-el";
  //   styleEl.innerHTML =
  //     ".react-draggable-transparent-selection *::-moz-selection {background: transparent;}\n";
  //   styleEl.innerHTML +=
  //     ".react-draggable-transparent-selection *::selection {background: transparent;}\n";
  //   document.getElementsByTagName("head")[0].appendChild(styleEl);
  // }
  // if (document.body)
  //   addClassName(document.body, "react-draggable-transparent-selection");
};
export const editorDragStopped = function () {
  document.body.classList.remove("sequenceDragging"); //needed to prevent the input bubble from losing focus post user drag
  window.__veDragging = false;
  caretPositionOnDragStart = null;
  setTimeout(function () {
    dragInProgress = false;
  });

  // //
  // try {
  //   if (document && document.body)
  //     removeClassName(document.body, "react-draggable-transparent-selection");
  //   // $FlowIgnore: IE
  //   if (document.selection) {
  //     // $FlowIgnore: IE
  //     document.selection.empty();
  //   } else {
  //     const selection = window.getSelection();

  //     if (
  //       selection.focusNode &&
  //       selection.focusNode.classList.contains("sequenceInputBubble")
  //     ) {
  //       return; //don't remove the selection if we're focused in the sequenceInputBubble!
  //     }
  //     selection.removeAllRanges(); // remove selection caused by scroll
  //   }
  // } catch (e) {
  //   // probably IE
  // }
};

// function addClassName(el: HTMLElement, className: string) {
//   if (el.classList) {
//     el.classList.add(className);
//   } else {
//     if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
//       el.className += ` ${className}`;
//     }
//   }
// }

// function removeClassName(el: HTMLElement, className: string) {
//   if (el.classList) {
//     el.classList.remove(className);
//   } else {
//     el.className = el.className.replace(
//       new RegExp(`(?:^|\\s)${className}(?!\\S)`, "g"),
//       ""
//     );
//   }
// }

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
    // console.log(
    //   `doNotWrapOrigin, caretPosition, selectionLayer.end+1:`,
    //   doNotWrapOrigin,
    //   caretPosition,
    //   selectionLayer.end + 1
    // );

    if (
      doNotWrapOrigin &&
      selectionLayer.end > -1 &&
      nearestCaretPos === selectionLayer.end + 1
    ) {
      // console.log(
      //   `start grabbed 1 nearestCaretPos, selectionLayer.start:`,
      //   nearestCaretPos,
      //   selectionLayer.end + 1
      // );
      caretPositionUpdate(nearestCaretPos);
      caretPositionOnDragStart = nearestCaretPos;
    } else if (doNotWrapOrigin && nearestCaretPos > selectionLayer.end + 1) {
      // console.log(
      //   `start grabbed 2 nearestCaretPos, selectionLayer.start:`,
      //   nearestCaretPos,
      //   selectionLayer.end + 1
      // );
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

function handleSelectionEndGrabbed({
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
      let newEnd = normalizePositionByRangeLength(
        nearestCaretPos - 1,
        sequenceLength
      );
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
  selectionLayerUpdate,
  caretPositionUpdate,
  doNotWrapOrigin
}) {
  let newCaret;
  let newRange;
  if (typeof newRangeOrCaret !== "object") {
    newCaret = newRangeOrCaret;
  } else {
    newRange = {
      start: newRangeOrCaret.start,
      end: newRangeOrCaret.end,
      forceUpdate: newRangeOrCaret.forceUpdate
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
        let distanceFromStart = getMinRangeLength(
          selectionLayer.start,
          newCaret,
          sequenceLength,
          doNotWrapOrigin
        );
        let distanceFromEnd = getMinRangeLength(
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
        let range1Shorter =
          getRangeLength(range1, sequenceLength) <
          getRangeLength(range2, sequenceLength);

        if (newRangeFullyContained) {
          range1Shorter
            ? selectionLayerUpdate(range1)
            : selectionLayerUpdate(range2);
        } else {
          selectionLayerUpdate({
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
  let range1 = getRangeLength({ start, end }, sequenceLength);
  let range2 = getRangeLength({ start: end, end: start }, sequenceLength);
  if (doNotWrapOrigin) {
    if (start < end) {
      return range1;
    } else {
      return range2;
    }
  }
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
