// import PropTypes from "prop-types";
import React from "react";
import { onlyUpdateForKeys } from "recompose";
import getXStartAndWidthOfRowAnnotation from "./getXStartAndWidthOfRowAnnotation";
import { getAnnotationRangeType } from "ve-range-utils";
import Orf from "./Orf";
import AnnotationContainerHolder from "./AnnotationContainerHolder";
import AnnotationPositioner from "./AnnotationPositioner";

function Orfs(props) {
  let {
    annotationRanges,
    bpsPerRow,
    charWidth,
    annotationHeight,
    spaceBetweenAnnotations,
    orfClicked,
    orfRightClicked,
    row,
    getGaps
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  annotationRanges.forEach(function(annotationRange) {
    if (annotationRange.yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = annotationRange.yOffset;
    }
    const { gapsBefore, gapsInside } = getGaps(annotationRange);
    let { annotation } = annotationRange;
    let { internalStartCodonIndices = [] } = annotation;
    let normalizedInternalStartCodonIndices = internalStartCodonIndices
      .filter(function(position) {
        if (position >= row.start && position <= row.end) {
          return true;
        } else return false;
      })
      .map(function(position) {
        return position - row.start;
      });

    let result = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth,
      gapsBefore,
      gapsInside
    );
    annotationsSVG.push(
      <AnnotationPositioner
        className={"veRowViewOrfs"}
        height={annotationHeight}
        width={result.width}
        key={"orf" + annotation.id + "start:" + annotationRange.start}
        top={
          annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)
        }
        left={result.xStart}
      >
        <Orf
          annotation={annotation}
          gapsInside={gapsInside}
          color={annotation.color}
          orfClicked={orfClicked}
          orfRightClicked={orfRightClicked}
          width={result.width}
          charWidth={charWidth}
          forward={annotation.forward}
          frame={annotation.frame}
          normalizedInternalStartCodonIndices={
            normalizedInternalStartCodonIndices
          }
          rangeType={getAnnotationRangeType(
            annotationRange,
            annotation,
            annotation.forward
          )}
          height={annotationHeight}
          name={annotation.name}
        />
      </AnnotationPositioner>
    );
  });
  let containerHeight =
    (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
  return (
    <AnnotationContainerHolder
      className="Orfs"
      containerHeight={containerHeight}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

// Orfs.propTypes = {
//   annotationRanges: PropTypes.array.isRequired,
//   charWidth: PropTypes.number.isRequired,
//   bpsPerRow: PropTypes.number.isRequired,
//   annotationHeight: PropTypes.number.isRequired,
//   spaceBetweenAnnotations: PropTypes.number.isRequired,
//   orfClicked: PropTypes.func.isRequired
// };

export default onlyUpdateForKeys([
  "annotationRanges",
  "bpsPerRow",
  "charWidth",
  "annotationHeight",
  "spaceBetweenAnnotations",
  "orfClicked",
  "orfRightClicked",
  "row",
  "getGaps"
])(Orfs);
