import { normalizePositionByRangeLength } from "ve-range-utils";
// import { onlyUpdateForKeys } from "recompose";
import getXStartAndWidthOfRangeWrtRow from "./getXStartAndWidthOfRangeWrtRow";
import React from "react";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
import pureNoFunc from "../utils/pureNoFunc";
import { divideBy3 } from "../utils/proteinUtils";

let Axis = function (props) {
  let {
    row,
    tickSpacing,
    bpsPerRow,
    charWidth,
    annotationHeight,
    marginTop,
    sequenceLength,
    showAxisNumbers = true,
    getGaps,
    isProtein,
    style
  } = props;
  if (row.start === 0 && row.end === 0) {
    return null;
  }

  let { xStart, width } = getXStartAndWidthOfRangeWrtRow({
    row,
    range: row,
    charWidth,
    sequenceLength,
    ...(getGaps ? getGaps(row) : {})
  });
  //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
  //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
  let xEnd = xStart + width;

  let yStart = 0;
  let tickMarkPositions = calculateTickMarkPositionsForGivenRange({
    tickSpacing,
    range: row,
    sequenceLength,
    isProtein
  });
  let tickMarkSVG = [];

  tickMarkPositions.forEach(function (tickMarkPosition, i) {
    let xCenter =
      (tickMarkPosition -
        (isProtein ? 1 : 0) +
        (getGaps ? getGaps(tickMarkPosition).gapsBefore : 0)) *
        charWidth +
      charWidth / 2;
    let yStart = 0;
    let yEnd = annotationHeight / 3;
    tickMarkSVG.push(
      <path
        key={"axisTickMarkPath " + i + " " + tickMarkPosition}
        d={"M" + xCenter + "," + yStart + " L" + xCenter + "," + yEnd}
        stroke="black"
      />
    );
    if (showAxisNumbers) {
      const position =
        normalizePositionByRangeLength(
          row.start + tickMarkPosition,
          sequenceLength
        ) + (isProtein ? 0 : 1);

      const positionLength = position.toString().length * 4;
      const textInner = divideBy3(position + (isProtein ? 1 : 0), isProtein);
      tickMarkSVG.push(
        <text
          data-tick-mark={textInner}
          key={"axisTickMarkText " + i + " " + tickMarkPosition}
          stroke="black"
          x={
            i === 0 //if first label in row, or last label in row, we add checks to make sure the axis number labels don't go outside of the width of the row
              ? Math.max(positionLength, xCenter)
              : i === tickMarkPositions.length - 1
              ? Math.min(bpsPerRow * charWidth - positionLength, xCenter)
              : xCenter
          }
          y={annotationHeight}
          style={{ textAnchor: "middle", fontSize: 10, fontFamily: "Verdana" }}
        >
          {textInner}
        </text>
      );
    }
  });

  return (
    <svg
      className="veRowViewAxis veAxis"
      width="100%"
      height={annotationHeight}
      style={{ marginTop, overflow: "visible", display: "block", ...style }}
    >
      {tickMarkSVG}
      <path
        d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
        stroke="black"
      />
    </svg>
  );
};

// export default Axis
// export default Axis
export default pureNoFunc(Axis);
