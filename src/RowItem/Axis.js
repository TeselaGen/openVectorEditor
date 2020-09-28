import { normalizePositionByRangeLength } from "ve-range-utils";
import getXStartAndWidthOfRangeWrtRow from "./getXStartAndWidthOfRangeWrtRow";
import React, { useMemo } from "react";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
import { divideBy3 } from "../utils/proteinUtils";
import { view } from "@risingstack/react-easy-state";
import { getVisibleStartEnd } from "../utils/getVisibleStartEnd";

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
    scrollData,
    isProtein,
    style
  } = props;
  if (row.start === 0 && row.end === 0) {
    return null;
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  /* eslint-disable react-hooks/exhaustive-deps */
  //memoize this function because it does the heavy lifting
  let tickMarkPositions = useMemo(() => {
    return calculateTickMarkPositionsForGivenRange({
      tickSpacing,
      range: row,
      sequenceLength,
      isProtein
    }).map((tickMarkPosition) => {
      const gaps = getGaps ? getGaps(tickMarkPosition).gapsBefore : 0;
      let xCenter =
        (tickMarkPosition - (isProtein ? 1 : 0) + gaps) * charWidth +
        charWidth / 2;
      return {
        tickMarkPosition,
        xCenter
      };
    });
  }, [tickSpacing, row.start, row.end, sequenceLength, isProtein, charWidth]);
  /* eslint-enable react-hooks/rules-of-hooks*/
  /* eslint-enable react-hooks/exhaustive-deps*/

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
  let visibleStart, visibleEnd;
  if (scrollData) {
    const val = getVisibleStartEnd({
      scrollData,
      width: sequenceLength * charWidth
    });
    //add a small buffer to either side of the visible start/end
    visibleStart = val.visibleStart - 400;
    visibleEnd = val.visibleEnd + 400;
  }

  let yStart = 0;
  let yEnd = annotationHeight / 3;

  let tickMarkSVG = [];

  tickMarkPositions.forEach(function ({ tickMarkPosition, xCenter }, i) {
    // const xCenterPlusXStart = xCenter + xStart;

    if (scrollData && !(xCenter < visibleEnd && xCenter > visibleStart)) return;
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
export default view(Axis);
// export default pureNoFunc(Axis);
