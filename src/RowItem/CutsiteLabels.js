import React from "react";
import { onlyUpdateForKeys } from "recompose";
import withHover from "../helperComponents/withHover";
import getXStartAndWidthOfRowAnnotation from "./getXStartAndWidthOfRowAnnotation";
import IntervalTree from "node-interval-tree";
import getYOffset from "../CircularView/getYOffset";
import forEach from "lodash/forEach";

function CutsiteLabels(props) {
  let {
    annotationRanges = {},
    bpsPerRow,
    charWidth,
    annotationHeight,
    onClick,
    onRightClick,
    textWidth = 10,
    editorName
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let warningMessage = null;
  if (Object.keys(annotationRanges).length > 50) {
    warningMessage = (
      <span style={{ color: "red" }}>
        <br />
        Warning: Only the first 50 cutsites will be displayed. Filter the
        cutsites you wish to see using the filter tool <br />
      </span>
    );
  }
  let rowLength = bpsPerRow * charWidth;
  let counter = 0;
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  let rowCenter = rowLength / 2;
  let iTree = new IntervalTree(rowCenter);
  forEach(annotationRanges, function(annotationRange, index) {
    counter++;
    if (counter > 50) return;
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
    const xStartOriginal = xStart;

    let xEnd = xStart + annotationLength;

    if (xEnd > rowLength) {
      xStart = xStart - (xEnd - rowLength);
      xEnd = rowLength;
    }
    let yOffset = getYOffset(iTree, xStart, xEnd);
    iTree.insert(xStart, xEnd, {
      ...annotationRange,
      yOffset
    });

    if (yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = yOffset;
    }
    let height = yOffset * annotationHeight;
    annotationsSVG.push(
      <DrawCutsiteLabel
        id={annotation.id}
        key={"cutsiteLabel" + index}
        {...{
          editorName,
          annotation,
          xStartOriginal,
          onClick,
          onRightClick,
          height,
          xStart
        }}
      />
    );
  });
  let containerHeight = (maxAnnotationYOffset + 1) * annotationHeight;
  return (
    <div
      width="100%"
      style={{
        position: "relative",
        height: containerHeight,
        display: "block"
      }}
      className="veRowViewCutsiteLabelsContainer"
    >
      {annotationsSVG}
      {warningMessage}
    </div>
  );
}

export default onlyUpdateForKeys([
  "annotationRanges",
  "bpsPerRow",
  "charWidth",
  "annotationHeight",
  "spaceBetweenAnnotations",
  "onClick",
  "textWidth",
  "editorName"
])(CutsiteLabels);

const DrawCutsiteLabel = withHover(
  ({
    hovered,
    className,
    annotation,
    onClick,
    onRightClick,
    height,
    xStartOriginal,
    onMouseLeave,
    onMouseOver,
    xStart
  }) => {
    return (
      <div>
        <div
          {...{ onMouseLeave, onMouseOver }}
          className={className + " veCutsiteLabel ve-monospace-font"}
          onClick={function(event) {
            onClick({ event, annotation });
            event.stopPropagation();
          }}
          onContextMenu={function(event) {
            onRightClick({ event, annotation });
            event.stopPropagation();
          }}
          style={{
            cursor: "pointer",
            // left: xStart,
            position: "absolute",
            bottom: height,
            ...(hovered && { fontWeight: "bold" }),
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
        {hovered && (
          <div
            style={{
              position: "absolute",
              left: xStartOriginal,
              bottom: 0,
              height: Math.max(height, 3),
              width: 2,
              background: "black"
            }}
          />
        )}
      </div>
    );
  }
);
