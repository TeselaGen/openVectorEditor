import isNumber from "lodash/isNumber";
import { getRangeAngles } from "ve-range-utils";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import draggableClassnames from "../constants/draggableClassnames";
import pureNoFunc from "../utils/pureNoFunc";
import { getSelectionMessage } from "../utils/editorUtils";

function Caret({
  caretPosition,
  sequenceLength,
  className,
  onClick,
  isSelection,
  innerRadius,
  outerRadius,
  isProtein,
  selectionMessage
}) {
  const { startAngle, endAngle } = getRangeAngles(
    { start: caretPosition, end: caretPosition },
    sequenceLength || 1
  );
  if (!isNumber(startAngle)) {
    console.error("we've got a problem!");
  }
  const { transform } = PositionAnnotationOnCircle({
    sAngle: startAngle,
    eAngle: endAngle,
    height: 0
  });
  return (
    <g
      onClick={onClick}
      transform={transform}
      className={className + " veCaret " + draggableClassnames.caret}
    >
      <title>
        {selectionMessage ||
          getSelectionMessage({ caretPosition, isProtein, sequenceLength })}
      </title>
      <line
        strokeWidth="1.5px"
        x1={0}
        y1={-innerRadius}
        x2={0}
        y2={-outerRadius}
        // stroke="black"
      />
      {isSelection ? (
        <polygon
          className="vePolygonCaretHandle"
          fill="black"
          points={`0,${-outerRadius + 2} 5,${-outerRadius - 10} -5,${
            -outerRadius - 10
          }`}
        />
      ) : null}
    </g>
  );
}

export default pureNoFunc(Caret);
