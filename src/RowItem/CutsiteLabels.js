import React from "react";
import withHover from "../helperComponents/withHover";
import getXStartAndWidthOfRowAnnotation from "./getXStartAndWidthOfRowAnnotation";
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
    editorName
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
      <DrawCutsiteLabel
        id={annotation.id}
        key={"cutsiteLabel" + index}
        {...{ editorName, annotation, cutsiteClicked, height, xStart }}
      />
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

export default CutsiteLabels;

const DrawCutsiteLabel = withHover(
  ({
    hoverActions,
    hoverProps: { className },
    annotation,
    cutsiteClicked,
    height,
    xStart
  }) => {
    return (
      <div
        {...hoverActions}
        className={className}
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
    );
  }
);
