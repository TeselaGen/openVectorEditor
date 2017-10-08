import PropTypes from "prop-types";
import React from "react";
import getXStartAndWidthOfRowAnnotation
  from "./getXStartAndWidthOfRowAnnotation";
import intervalTree2 from "teselagen-interval-tree";
import getYOffset from "../CircularView/getYOffset";
import forEach from "lodash/forEach";

function CutsiteLabels(props) {
  let {
    annotationRanges = {},
    bpsPerRow,
    charWidth,
    annotationHeight,
    spaceBetweenAnnotations,
    cutsiteClicked,
    textWidth = 12,
    HoverHelper
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  let rowCenter = bpsPerRow * textWidth / 2;
  let iTree = new intervalTree2(rowCenter);
  forEach(annotationRanges, function(annotationRange, index) {
    let annotation = annotationRange.annotation;
    if (!annotation) {
      annotation = annotationRange;
    }
    let annotationLength = annotation.restrictionEnzyme.name.length * textWidth;
    let { xStart } = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth
    );
    let xEnd = xStart + annotationLength;
    let rowLength = bpsPerRow * charWidth;
    if (xEnd > rowLength) {
      xStart = xStart - (xEnd - rowLength);
      xEnd = rowLength;
    }
    let yOffset = getYOffset(iTree, xStart, xEnd);
    iTree.add(xStart, xEnd, undefined, { ...annotationRange, yOffset });

    if (yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = yOffset;
    }
    let height = yOffset * (annotationHeight + spaceBetweenAnnotations);
    annotationsSVG.push(
      <HoverHelper
        id={annotation.id}
        key={"cutsiteLabel" + index}
        passJustOnMouseOverAndClassname
      >
        <div
          className={""}
          onClick={function(event) {
            cutsiteClicked({ event, annotation });
            event.stopPropagation();
          }}
          style={{
            // left: xStart,
            position: "absolute",
            top: height,
            // display: 'inline-block',
            // position: (relative) ? 'relative' : 'absolute',
            // // float: 'left',
            left: xStart,
            zIndex: 10
            // left: '100 % ',
          }}
        >
          {annotation.restrictionEnzyme.name}
        </div>
      </HoverHelper>
    );
  });
  let containerHeight =
    (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
  return (
    <div
      width="100%"
      style={{
        position: "relative",
        height: containerHeight,
        display: "block"
      }}
      className="cutsiteContainer"
    >
      {annotationsSVG}
    </div>
  );
}

CutsiteLabels.propTypes = {
  annotationRanges: PropTypes.array.isRequired,
  charWidth: PropTypes.number.isRequired,
  bpsPerRow: PropTypes.number.isRequired,
  annotationHeight: PropTypes.number.isRequired,
  spaceBetweenAnnotations: PropTypes.number.isRequired,
  cutsiteClicked: PropTypes.func.isRequired
};

export default CutsiteLabels;
