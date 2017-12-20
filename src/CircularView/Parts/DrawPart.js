import React from "react";
import withHover from "../../helperComponents/withHover";
import PositionAnnotationOnCircle from "../PositionAnnotationOnCircle";
import getAnnotationNameAndStartStopString from "../../utils/getAnnotationNameAndStartStopString";
import Part from "./Part";

export default withHover(function({
  hoverActions,
  hoverProps: { className },
  startAngle,
  endAngle,
  onClick,
  annotation,
  totalAngle,
  annotationColor,
  annotationRadius,
  partHeight
}) {
  return (
    <g {...hoverActions} className={className} onClick={onClick}>
      <title>{getAnnotationNameAndStartStopString(annotation)}</title>
      <PositionAnnotationOnCircle
        sAngle={startAngle}
        eAngle={endAngle}
        forward={!annotation.forward}
      >
        <Part
          totalAngle={totalAngle}
          color={annotationColor}
          radius={annotationRadius}
          annotationHeight={partHeight}
        />
      </PositionAnnotationOnCircle>
    </g>
  );
});
