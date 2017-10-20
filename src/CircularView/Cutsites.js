/* @flow */
import getRangeAngles from "./getRangeAnglesSpecial";
// import lruMemoize from "lru-memoize";
import PositionAnnotationOnCircle from "./PositionAnnotationOnCircle";
import React from "react";
import each from "lodash/each";
import withHover from "../helperComponents/withHover";

function Cutsites({
  radius,
  editorName,
  cutsiteClicked,
  cutsites,
  cutsiteWidth = 1,
  annotationHeight = 15,
  sequenceLength
}) {
  radius += annotationHeight;
  let svgGroup = [];
  let labels = {};
  let index = 0;
  each(cutsites, function(annotation /* key */) {
    index++;
    function onClick(event) {
      cutsiteClicked({ event, annotation });
      event.stopPropagation();
    }
    if (!(annotation.topSnipPosition > -1)) {
      //we need this to be present
    }
    let { startAngle } = getRangeAngles(
      { start: annotation.topSnipPosition, end: annotation.topSnipPosition },
      sequenceLength
    );
    //expand the end angle if annotation spans the origin
    labels[annotation.id] = {
      annotationCenterAngle: startAngle,
      annotationCenterRadius: radius,
      text: annotation.restrictionEnzyme.name,
      color: annotation.restrictionEnzyme.color,
      className: " veCutsiteLabel",
      id: annotation.id,
      onClick
    };
    /* eslint-disable */

    if (!annotation.id) debugger;
    /* eslint-enable */

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
      <g key={"cutsites"} className={"cutsites"}>
        {svgGroup}
      </g>
    )
  };
}

export default Cutsites;
// export default lruMemoize(5, undefined, true)(Cutsites);

const DrawCutsite = withHover(function({
  hoverActions,
  hoverProps: { className },
  startAngle,
  radius,
  cutsiteWidth,
  annotationHeight
}) {
  return (
    <PositionAnnotationOnCircle
      sAngle={startAngle}
      eAngle={startAngle}
      height={radius}
    >
      <rect
        {...hoverActions}
        className={className}
        width={cutsiteWidth}
        height={annotationHeight}
      />
    </PositionAnnotationOnCircle>
  );
});
