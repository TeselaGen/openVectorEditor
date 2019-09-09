/* @flow */
import getRangeAngles from "./getRangeAnglesSpecial";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import each from "lodash/each";
import withHover from "../helperComponents/withHover";
import pureNoFunc from "../utils/pureNoFunc";

function Cutsites({
  radius,
  editorName,
  showCutsiteLabels,
  cutsiteClicked,
  cutsiteRightClicked,
  cutsites,
  cutsiteWidth = 1,
  annotationHeight = 15,
  sequenceLength
}) {
  radius += annotationHeight;
  let svgGroup = [];
  let labels = {};
  let index = 0;
  if (!Object.keys(cutsites).length) return null;
  each(cutsites, function(annotation /* key */) {
    index++;

    if (!(annotation.topSnipPosition > -1)) {
      //we need this to be present
    }
    let { startAngle } = getRangeAngles(
      { start: annotation.topSnipPosition, end: annotation.topSnipPosition },
      sequenceLength
    );
    if (showCutsiteLabels) {
      //expand the end angle if annotation spans the origin
      labels[annotation.id] = {
        annotationCenterAngle: startAngle,
        annotationCenterRadius: radius,
        text: annotation.restrictionEnzyme.name,
        color: annotation.restrictionEnzyme.color,
        className: " veCutsiteLabel",
        id: annotation.id,
        onClick: event => {
          cutsiteClicked({ event, annotation });
          event.stopPropagation();
        },
        onContextMenu: event => {
          cutsiteRightClicked({ event, annotation });
          event.stopPropagation();
        }
      };
    }
    svgGroup.push(
      <DrawCutsite
        key={"cutsite" + index}
        {...{
          editorName,
          id: annotation.id,
          startAngle,
          radius,
          cutsiteWidth,
          annotationHeight
        }}
      />
    );
  });
  return {
    height: annotationHeight,
    labels,
    component: (
      <g key="cutsites" className="cutsites">
        {svgGroup}
      </g>
    )
  };
}

export default Cutsites;

const DrawCutsite = pureNoFunc(
  withHover(function({
    className,
    startAngle,
    radius,
    cutsiteWidth,
    annotationHeight,
    onMouseLeave,
    onMouseOver
  }) {
    return (
      <rect
        {...PositionAnnotationOnCircle({
          sAngle: startAngle,
          eAngle: startAngle,
          height: radius
        })}
        {...{ onMouseLeave, onMouseOver }}
        className={className}
        width={cutsiteWidth}
        height={annotationHeight}
      />
    );
  })
);
