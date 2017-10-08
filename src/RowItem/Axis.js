import normalizePositionByRangeLength
  from "ve-range-utils/normalizePositionByRangeLength";
import getXStartAndWidthOfRangeWrtRow from "./getXStartAndWidthOfRangeWrtRow";
import PropTypes from "prop-types";
import React from "react";
import calculateTickMarkPositionsForGivenRange
  from "../utils/calculateTickMarkPositionsForGivenRange";
import getXCenterOfRowAnnotation from "./getXCenterOfRowAnnotation";

let Axis = function(props) {
  let {
    row,
    tickSpacing,
    bpsPerRow,
    charWidth,
    annotationHeight,
    sequenceLength
  } = props;
  if (row.start === 0 && row.end === 0) {
    return null;
  }
  let { xStart, width } = getXStartAndWidthOfRangeWrtRow(
    row,
    row,
    bpsPerRow,
    charWidth,
    sequenceLength
  );
  //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
  //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
  let xEnd = xStart + width;

  let yStart = 0;
  let tickMarkPositions = calculateTickMarkPositionsForGivenRange({
    tickSpacing,
    range: row,
    sequenceLength
  });
  let tickMarkSVG = [];

  tickMarkPositions.forEach(function(tickMarkPosition) {
    // var xCenter = getXCenterOfRowAnnotation({
    //     start: tickMarkPosition,
    //     end: tickMarkPosition
    // }, row, bpsPerRow, charWidth, sequenceLength);
    let xCenter = tickMarkPosition * charWidth + charWidth / 2;
    let yStart = 0;
    let yEnd = annotationHeight / 3;
    tickMarkSVG.push(
      <path
        key={"axisTickMark " + row.rowNumber + " " + tickMarkPosition}
        d={"M" + xCenter + "," + yStart + " L" + xCenter + "," + yEnd}
        stroke={"black"}
      />
    );
    tickMarkSVG.push(
      <text
        key={"axisTickMarkText " + row.rowNumber + " " + tickMarkPosition}
        stroke={"black"}
        x={xCenter}
        y={annotationHeight}
        style={{ textAnchor: "middle", fontSize: 10, fontFamily: "Verdana" }}
      >
        {normalizePositionByRangeLength(
          row.start + tickMarkPosition,
          sequenceLength
        ) + 1}
      </text>
    );
  });

  return (
    <svg
      className="veRowViewAxis veAxis"
      width="100%"
      height={annotationHeight * 1.2}
    >
      {tickMarkSVG}
      <path
        key={"axis " + row.rowNumber}
        d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
        stroke={"black"}
      />
    </svg>
  );
};

export default Axis;
