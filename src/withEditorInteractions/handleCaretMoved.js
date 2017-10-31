import { trimNumberToFitWithin0ToAnotherNumber } from "ve-range-utils";
import { normalizePositionByRangeLength } from "ve-range-utils";
export default function handleCaretMoved({
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

function normalizeNewCaretPos(caretPosition, sequenceLength, circular) {
  if (circular) {
    return normalizePositionByRangeLength(caretPosition, sequenceLength, true);
  } else {
    return trimNumberToFitWithin0ToAnotherNumber(caretPosition, sequenceLength);
  }
}
