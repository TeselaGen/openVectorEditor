import classnames from "classnames";
import AnnotationPositioner from "../AnnotationPositioner";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import React from "react";

import "./style.css";

import getXStartAndWidthOfRangeWrtRow from "../getXStartAndWidthOfRangeWrtRow";
import getOverlapsOfPotentiallyCircularRanges
  from "ve-range-utils/getOverlapsOfPotentiallyCircularRanges";

function LineageLines(props) {
  let {
    charWidth,
    bpsPerRow,
    row,
    sequenceLength,
    lineageLines = [],
    lineageLineHeight = 6
  } = props;

  let lineageLinesToUse = lineageLines;
  if (!Array.isArray(lineageLines)) {
    lineageLinesToUse = [lineageLines];
  }
  return (
    <AnnotationContainerHolder
      className="veRowViewLineageLines"
      containerHeight={lineageLineHeight}
    >
      {lineageLinesToUse
        .sort(function(lineageLine) {
          return lineageLine.inBetweenBps ? 1 : 0;
        })
        .map(function(lineageLine, index) {
          let rangeSpansSequence =
            lineageLine.start === lineageLine.end + 1 ||
            (lineageLine.start === 0 && lineageLine.end === sequenceLength - 1);
          let { className = "", style = {}, color } = lineageLine;
          let overlaps = getOverlapsOfPotentiallyCircularRanges(
            lineageLine,
            row,
            sequenceLength
          );
          return overlaps.map(function(overlap, index2) {
            let { xStart, width } = getXStartAndWidthOfRangeWrtRow(
              overlap,
              row,
              bpsPerRow,
              charWidth,
              sequenceLength
            );
            let lineageStart = overlap.start === lineageLine.start;
            let lineageEnd = overlap.end === lineageLine.end;

            return [
              <AnnotationPositioner
                height={lineageLineHeight}
                width={width}
                key={index}
                top={0}
                // className={classnames() }
                left={xStart + (lineageLine.inBetweenBps ? charWidth / 1.2 : 0)}
              >
                <g>
                  <rect
                    fill={color}
                    x="0"
                    y="0"
                    height={lineageLineHeight}
                    width={width}
                  />
                  {rangeSpansSequence &&
                    lineageStart &&
                    <rect
                      fill={"#408CE1"}
                      x="0"
                      y="0"
                      height={lineageLineHeight}
                      width={4}
                    />}
                  {rangeSpansSequence &&
                    lineageEnd &&
                    <rect
                      fill={"#408CE1"}
                      x={width - 4}
                      y="0"
                      height={lineageLineHeight}
                      width={4}
                    />}
                </g>
              </AnnotationPositioner>
            ];
          });
        })}
    </AnnotationContainerHolder>
  );
}

export default LineageLines;
