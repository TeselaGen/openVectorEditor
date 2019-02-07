import isNumber from "lodash/isNumber";
import { getRangeAngles } from "ve-range-utils";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import draggableClassnames from "../constants/draggableClassnames";
import pureNoFunc from "../utils/pureNoFunc";

function Caret({
  caretPosition,
  sequenceLength,
  className,
  innerRadius,
  outerRadius
}) {
  let { startAngle, endAngle } = getRangeAngles(
    { start: caretPosition, end: caretPosition },
    sequenceLength
  );
  if (!isNumber(startAngle)) {
    console.error("we've got a problem!");
  }
  return (
    <g className="ve-caret-holder">
      <title>{"Caret before BP " + (caretPosition + 1)}</title>
      <line
        {...PositionAnnotationOnCircle({
          sAngle: startAngle,
          eAngle: endAngle,
          height: 0
        })}
        className={className + " veCaret " + draggableClassnames.caret}
        strokeWidth="2px"
        style={{ opacity: 9, zIndex: 100, cursor: "ew-resize" }} //tnr: the classname needs to be cursor here!
        x1={0}
        y1={-innerRadius}
        x2={0}
        y2={-outerRadius}
        stroke="black"
      />
    </g>
  );
}

export default pureNoFunc(Caret);
