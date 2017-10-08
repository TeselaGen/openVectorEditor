import Caret from "./Caret";
import sector from "paths-js/sector";
import getRangeAngles from "./getRangeAnglesSpecial";
import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
// import PropTypes from "prop-types";
import React from "react";
import draggableClassnames from "../constants/draggableClassnames";

function SelectionLayer({
  selectionLayer,
  sequenceLength,
  radius,
  innerRadius,
  selectionLayerRightClicked,
  index
}) {
  let { color, start, end, showCaret = false } = selectionLayer;
  let { startAngle, endAngle, totalAngle } = getRangeAngles(
    selectionLayer,
    sequenceLength
  );

  let section = sector({
    center: [0, 0], //the center is always 0,0 for our annotations :) we rotate later!
    r: innerRadius,
    R: radius,
    start: 0,
    end: totalAngle
  });

  let section2 = sector({
    center: [0, 0], //the center is always 0,0 for our annotations :) we rotate later!
    r: innerRadius,
    R: radius,
    start: 0,
    end: Math.PI * 2 - totalAngle
  });

  return (
    <g
      onContextMenu={event => {
        selectionLayerRightClicked({
          annotation: selectionLayer,
          event
        });
      }}
      key={"veSelectionLayer" + index}
      className="veSelectionLayer"
    >
      <PositionAnnotationOnCircle
        className="selectionLayerWrapper"
        sAngle={startAngle}
        eAngle={endAngle}
        height={0}
      >
        <path
          className="selectionLayer"
          style={{ opacity: 0.3 }}
          d={section.path.print()}
          fill={color || "rgb(0, 153, 255)"}
        />
      </PositionAnnotationOnCircle>
      <PositionAnnotationOnCircle
        className="selectionLayerInverseWrapper"
        sAngle={endAngle}
        eAngle={startAngle}
        height={0}
      >
        <path
          className="selectionLayerInverse"
          style={{ opacity: 0.2 }}
          d={section2.path.print()}
          fill={color || "red"}
        />
      </PositionAnnotationOnCircle>
      {!showCaret &&
        <Caret
          key="caret1"
          className={
            "selectionLayerCaret " + draggableClassnames.selectionStart
          }
          caretPosition={start}
          sequenceLength={sequenceLength}
          innerRadius={innerRadius}
          outerRadius={radius}
        />}
      {!showCaret &&
        <Caret
          key="caret2"
          className={"selectionLayerCaret " + draggableClassnames.selectionEnd}
          caretPosition={end + 1}
          sequenceLength={sequenceLength}
          innerRadius={innerRadius}
          outerRadius={radius}
        />}
    </g>
  );
}

export default lruMemoize(5, undefined, true)(SelectionLayer);
