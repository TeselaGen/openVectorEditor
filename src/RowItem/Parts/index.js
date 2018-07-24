import pureNoFunc from "../../utils/pureNoFunc";
import "./style.css";
import forEach from "lodash/forEach";
import React from "react";

// import './style.css'
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

import { getAnnotationRangeType } from "ve-range-utils";
import Part from "./Part";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";

function Parts(props) {
  const {
    annotationRanges = [],
    bpsPerRow,
    charWidth,
    annotationHeight = 12,
    spaceBetweenAnnotations = 2,
    partClicked,
    partRightClicked,
    editorName,
    marginTop = 10,
    getGaps
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
    const { gapsBefore, gapsInside } = getGaps(annotationRange);
    const annotation = annotationRange.annotation;
    const annotationColor = "purple";

    const result = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth,
      gapsBefore,
      gapsInside
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
        <Part
          key={index}
          editorName={editorName}
          id={annotation.id}
          partClicked={partClicked}
          partRightClicked={partRightClicked}
          annotation={annotation}
          gapsInside={gapsInside}
          gapsBefore={gapsBefore}
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
      className={"veRowViewPartContainer"}
      containerHeight={containerHeight}
      marginTop={marginTop}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

export default pureNoFunc(Parts);
