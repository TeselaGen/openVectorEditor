import { noop } from "teselagen-react-components";
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
  onRightClicked,
  onClick,
  index,
  isProtein
}) {
  const {
    color,
    start,
    end,
    hideCarets = false,
    style,
    className
  } = selectionLayer;
  const { startAngle, endAngle, totalAngle } = getRangeAngles(
    selectionLayer,
    sequenceLength
  );

  const section = sector({
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
  const { transform } = PositionAnnotationOnCircle({
    sAngle: startAngle,
    eAngle: endAngle,
    height: 0
  });
  return (
    <g
      onContextMenu={(event) => {
        onRightClicked &&
          onRightClicked({
            annotation: selectionLayer,
            event
          });
      }}
      onClick={
        onClick
          ? (event) => {
              onClick({
                annotation: selectionLayer,
                event
              });
            }
          : undefined
      }
      key={"veSelectionLayer" + index}
      className={"veSelectionLayer " + (className || "")}
    >
      {!hideTitle && <title>{selectionMessage}</title>}
      <path
        transform={transform}
        className="selectionLayer"
        style={{ opacity: 0.3, ...style }}
        d={section.path.print()}
        fill={color}
      />
      {!hideCarets && (
        <Caret
          key="caret1"
          className={
            className +
            " selectionLayerCaret " +
            (isDraggable ? draggableClassnames.selectionStart : "")
          }
          isSelection
          onClick={onClick ? noop : preventDefaultStopPropagation}
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
            className +
            " selectionLayerCaret " +
            (isDraggable ? draggableClassnames.selectionEnd : "")
          }
          isSelection
          onClick={onClick ? noop : preventDefaultStopPropagation}
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
