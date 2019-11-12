import React from "react";
import pure from "../../utils/pureNoFunc";
import "./style.css";
import { getSelectionMessage } from "../../utils/editorUtils";
// import draggableClassnames from "../../constants/draggableClassnames";

function Caret(props) {
  let {
    charWidth,
    row,
    sequenceLength,
    caretPosition,
    isProtein,
    onClick,
    onRightClick,
    selectionMessage,
    className = ""
    // getGaps,
    // ignoreGaps
  } = props;

  if (
    (row.start <= caretPosition && row.end + 1 >= caretPosition) ||
    (row.end === sequenceLength - 1 && row.end < caretPosition)
  ) {
    // const { gapsBefore = 0 } =
    //   !ignoreGaps && getGaps ? getGaps(caretPosition) : {};
    //the second logical operator catches the special case where we're at the very end of the sequence..
    let cursorEl = (
      <div
        onClick={onClick}
        onContextMenu={
          onRightClick
            ? e => {
                onRightClick(e);
              }
            : undefined
        }
        title={
          selectionMessage ||
          getSelectionMessage({ caretPosition, isProtein, sequenceLength })
        }
        className={"veCaret veRowViewCaret " + className}
        style={{
          left: (caretPosition - row.start) * charWidth - 2
        }}
      />
    );
    return cursorEl;
  } else {
    return null;
  }
}

export default pure(Caret);
