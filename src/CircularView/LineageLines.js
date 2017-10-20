import color from "color";
import randomcolor from "randomcolor";
import drawDirectedPiePiece from "./drawDirectedPiePiece";
import getRangeAngles from "./getRangeAnglesSpecial";
import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import withHover from "../helperComponents/withHover";

function LineageLines(props) {
  let {
    radius,
    editorName,
    sequenceLength,
    lineageLines = [],
    annotationHeight
  } = props;
  let lineageLinesToUse = lineageLines;
  if (!Array.isArray(lineageLines)) {
    lineageLinesToUse = [lineageLines];
  }
  let height = 0;
  let component = (
    <g key="veLineageLines" className="veLineageLines">
      {lineageLinesToUse
        .map(function(lineageLine, index) {
          if (
            !(
              lineageLine.start > -1 &&
              lineageLine.end > -1 &&
              sequenceLength > 0
            )
          ) {
            return null;
          }
          height = annotationHeight;
          let { startAngle, endAngle, totalAngle } = getRangeAngles(
            lineageLine,
            sequenceLength
          );
          let path = drawDirectedPiePiece({
            radius: radius + annotationHeight / 2,
            annotationHeight,
            totalAngle,
            arrowheadLength: 0,
            tailThickness: 1 //lineageLine specific
          });
          return (
            <PositionAnnotationOnCircle
              key={"lineageLine" + index}
              sAngle={startAngle}
              eAngle={endAngle}
              forward
            >
              <DrawLineageLine
                {...{ editorName, lineageLine, path }}
                id={lineageLine.id}
                className="veLineageLine"
              />
            </PositionAnnotationOnCircle>
          );
        })
        .filter(el => el)}
    </g>
  );
  return {
    component,
    height
  };
}

export default lruMemoize(5, undefined, true)(LineageLines);

const DrawLineageLine = withHover(function({
  hoverProps: { hovered },
  hoverActions,
  hoverProps: { className },
  lineageLine,
  path
}) {
  let colorToUse = hovered
    ? color(lineageLine.color)
        .lighten(0.1)
        .hex()
    : lineageLine.color;
  return (
    <path
      strokeWidth={hovered ? 1.5 : 0}
      stroke={colorToUse}
      fill={colorToUse || randomcolor()}
      d={path.print()}
      {...hoverActions}
      className={className}
    />
  );
});
