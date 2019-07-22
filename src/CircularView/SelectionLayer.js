import Caret from "./Caret";
import sector from "paths-js/sector";
import getRangeAngles from "./getRangeAnglesSpecial";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import draggableClassnames from "../constants/draggableClassnames";
import pureNoFunc from "../utils/pureNoFunc";
import {
  getSelectionMessage,
  preventDefaultStopPropagation
} from "../utils/editorUtils";

function SelectionLayer({
  isDraggable,
  selectionLayer,
  sequenceLength,
  radius,
  hideTitle,
  innerRadius,
  selectionLayerRightClicked,
  index,
  isProtein
}) {
  let { color, start, end, hideCarets = false } = selectionLayer;
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

  const selectionMessage = getSelectionMessage({
    sequenceLength,
    selectionLayer,
    isProtein
  });
  // let section2 = sector({
  //   center: [0, 0], //the center is always 0,0 for our annotations :) we rotate later!
  //   r: innerRadius,
  //   R: radius,
  //   start: 0,
  //   end: Math.PI * 2 - totalAngle
  // });

  return (
    <g
      onContextMenu={event => {
        selectionLayerRightClicked &&
          selectionLayerRightClicked({
            annotation: selectionLayer,
            event
          });
      }}
      key={"veSelectionLayer" + index}
      className="veSelectionLayer"
    >
      {!hideTitle && <title>{selectionMessage}</title>}
      <path
        {...PositionAnnotationOnCircle({
          sAngle: startAngle,
          eAngle: endAngle,
          height: 0
        })}
        className="selectionLayer"
        style={{ opacity: 0.3 }}
        d={section.path.print()}
        fill={color || "rgb(0, 153, 255)"}
      />
      {!hideCarets && (
        <Caret
          key="caret1"
          className={
            "selectionLayerCaret " +
            (isDraggable ? draggableClassnames.selectionStart : "")
          }
          onClick={preventDefaultStopPropagation}
          selectionMessage={selectionMessage}
          caretPosition={start}
          sequenceLength={sequenceLength}
          innerRadius={innerRadius}
          outerRadius={radius}
        />
      )}
      {!hideCarets && (
        <Caret
          key="caret2"
          className={
            "selectionLayerCaret " +
            (isDraggable ? draggableClassnames.selectionEnd : "")
          }
          onClick={preventDefaultStopPropagation}
          selectionMessage={selectionMessage}
          caretPosition={end + 1}
          sequenceLength={sequenceLength}
          innerRadius={innerRadius}
          outerRadius={radius}
        />
      )}
    </g>
  );
}

export default pureNoFunc(SelectionLayer);
