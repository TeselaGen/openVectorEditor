import "./style.css";
import forEach from "lodash/forEach";
import React from "react";

// import './style.css'
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

import { getAnnotationRangeType } from "ve-range-utils";
import Chromatogram from "./Chromatogram";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";

function Chromatograms(props) {
  const {
    annotationRanges = [],
    bpsPerRow,
    charWidth,
    annotationHeight = 12,
    spaceBetweenAnnotations = 2,
    chromatogramClicked,
    chromatogramRightClicked,
    editorName,
    marginTop = 10
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  const annotationsSVG = [];
  forEach(annotationRanges, function(annotationRange, index) {
    if (annotationRange.yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = annotationRange.yOffset;
    }
    const annotation = annotationRange.annotation;
    const annotationColor = "purple";

    const result = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth
    );
    annotationsSVG.push(
      <AnnotationPositioner
        height={annotationHeight}
        width={result.width}
        key={index}
        top={
          annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)
        }
        left={result.xStart}
      >
        <Chromatogram
          key={index}
          editorName={editorName}
          id={annotation.id}
          chromatogramClicked={chromatogramClicked}
          chromatogramRightClicked={chromatogramRightClicked}
          annotation={annotation}
          color={annotationColor}
          widthInBps={annotationRange.end - annotationRange.start + 1}
          charWidth={charWidth}
          forward={annotation.forward}
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
      className={"veRowViewChromatogramContainer"}
      containerHeight={containerHeight}
      marginTop={marginTop}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

export default Chromatograms;
