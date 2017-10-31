import isNumber from "lodash/isNumber";
import { getRangeAngles } from "ve-range-utils";
// import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import draggableClassnames from "../constants/draggableClassnames";

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
    <PositionAnnotationOnCircle
      key="caret"
      className={className + " " + draggableClassnames.caret}
      sAngle={startAngle}
      eAngle={endAngle}
      height={0}
    >
      <line
        className={className}
        strokeWidth="2px"
        style={{ opacity: 9, zIndex: 100, cursor: "ew-resize" }} //tnr: the classname needs to be cursor here!
        x1={0}
        y1={-innerRadius}
        x2={0}
        y2={-outerRadius}
        stroke="black"
      />
    </PositionAnnotationOnCircle>
  );
}

// export default lruMemoize(5, undefined, true)(Caret);
export default Caret;
