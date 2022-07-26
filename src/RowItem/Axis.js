import { normalizePositionByRangeLength } from "ve-range-utils";
import getXStartAndWidthOfRangeWrtRow from "./getXStartAndWidthOfRangeWrtRow";
import React, { useMemo } from "react";
import calculateTickMarkPositionsForGivenRange from "../utils/calculateTickMarkPositionsForGivenRange";
import { divideBy3 } from "../utils/proteinUtils";
import { view } from "@risingstack/react-easy-state";
import { getVisibleStartEnd } from "../utils/getVisibleStartEnd";

const Axis = function (props) {
  const {
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
    style,
    isLinearView
  } = props;
  const noRows = row.start === 0 && row.end === 0;
  /* eslint-disable react-hooks/exhaustive-deps */
  //memoize this function because it does the heavy lifting
  const tickMarkPositions = useMemo(() => {
    if (noRows) return [];
    return calculateTickMarkPositionsForGivenRange({
      tickSpacing,
      range: row,
      sequenceLength,
      isProtein
    }).map((tickMarkPosition) => {
      const gaps = getGaps ? getGaps(tickMarkPosition).gapsBefore : 0;
      const xCenter =
        (tickMarkPosition - (isProtein ? 1 : 0) + gaps) * charWidth +
        charWidth / 2;
      return {
        tickMarkPosition,
        xCenter
      };
    });
  }, [
    noRows,
    tickSpacing,
    row.start,
    row.end,
    sequenceLength,
    isProtein,
    charWidth
  ]);
  /* eslint-enable react-hooks/exhaustive-deps*/
  if (noRows) {
    return null;
  }
  const { xStart, width } = getXStartAndWidthOfRangeWrtRow({
    row,
    range: row,
    charWidth,
    sequenceLength,
    ...(getGaps ? getGaps(row) : {})
  });
  //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
  //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
  const xEnd = xStart + width;
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

  const yStart = 0;
  // const yEnd = annotationHeight / 3;

  const tickMarkSVG = [];

  tickMarkPositions.forEach(function ({ tickMarkPosition, xCenter }, i) {
    // const xCenterPlusXStart = xCenter + xStart;

    if (scrollData && !(xCenter < visibleEnd && xCenter > visibleStart)) return;
    tickMarkSVG.push(
      <rect
        className="veAxisTick"
        key={"axisTickMarkPath " + i + " " + tickMarkPosition}
        x={xCenter}
        width={1}
        height={5}
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

      let x = xCenter;
      if (!isLinearView) {
        x =
          i === 0 //if first label in row, or last label in row, we add checks to make sure the axis number labels don't go outside of the width of the row
            ? Math.max(positionLength, xCenter)
            : i === tickMarkPositions.length - 1
            ? Math.min(bpsPerRow * charWidth - positionLength, xCenter)
            : xCenter;
      }
      tickMarkSVG.push(
        <text
          data-tick-mark={textInner}
          key={"axisTickMarkText " + i + " " + tickMarkPosition}
          fill="black"
          x={x}
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
        className="veAxisLine"
        d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
        stroke="black"
      />
    </svg>
  );
};

// export default Axis
export default view(Axis);
// export default pureNoFunc(Axis);
