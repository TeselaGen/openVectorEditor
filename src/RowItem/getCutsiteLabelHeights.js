//tnr: not actually used yet. I don't think it is necessary
// for the cutsite label heights to be perfect

import getXStartAndWidthOfRowAnnotation from "./getXStartAndWidthOfRowAnnotation";
import IntervalTree from "node-interval-tree";
import getYOffset from "../CircularView/getYOffset";
import forEach from "lodash/forEach";

export default function getCutsiteLabelHeights({
  bpsPerRow,
  charWidth,
  annotationRanges,
  annotationHeight,
  spaceBetweenAnnotations,
  textWidth
}) {
  let rowLength = bpsPerRow * charWidth;
  let counter = 0;
  let maxAnnotationYOffset = 0;
  let rowCenter = rowLength / 2;
  let iTree = new IntervalTree(rowCenter);
  forEach(annotationRanges, function(annotationRange) {
    counter++;
    if (counter > 50) return;
    let annotation = annotationRange.annotation;
    if (!annotation) {
      annotation = annotationRange;
    }
    let labelLength = annotation.restrictionEnzyme.name.length * textWidth;
    let { xStart } = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth
    );
    let xEnd = xStart + labelLength;

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
    let height = yOffset * (annotationHeight + spaceBetweenAnnotations);
    annotation.height = height;
  });
  let containerHeight =
    (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
  return containerHeight;
}
