import "./style.css";
import forEach from "lodash/forEach";
import React from "react";
import featureColorMap from "../../constants/featureColorMap.json";

// import './style.css'
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

import { getAnnotationRangeType } from "ve-range-utils";
import Feature from "./Feature";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";

function Features(props) {
  let {
    annotationRanges = [],
    bpsPerRow,
    charWidth,
    annotationHeight = 12,
    spaceBetweenAnnotations = 2,
    featureClicked,
    featureRightClicked,
    editorName,
    isPart = false
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  forEach(annotationRanges, function(annotationRange, index) {
    if (annotationRange.yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = annotationRange.yOffset;
    }
    let annotation = annotationRange.annotation;
    let annotationColor = annotation.color || "#BBBBBB";
    if (annotation.type) {
      if (featureColorMap[annotation.type]) {
        annotationColor = featureColorMap[annotation.type];
      }
    }
    let result = getXStartAndWidthOfRowAnnotation(
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
        <Feature
          isPart={isPart}
          key={index}
          editorName={editorName}
          id={annotation.id}
          featureClicked={featureClicked}
          featureRightClicked={featureRightClicked}
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
      className={"veRowViewFeatureContainer"}
      containerHeight={containerHeight}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

// Features.propTypes = {
//   annotationRanges: PropTypes.arrayOf(
//     PropTypes.shape({
//       start: PropTypes.number.isRequired,
//       end: PropTypes.number.isRequired,
//       yOffset: PropTypes.number.isRequired,
//       annotation: PropTypes.shape({
//         start: PropTypes.number.isRequired,
//         end: PropTypes.number.isRequired,
//         forward: PropTypes.bool,
//         id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//       })
//     })
//   ),
//   charWidth: PropTypes.number.isRequired,
//   bpsPerRow: PropTypes.number.isRequired,
//   annotationHeight: PropTypes.number.isRequired,
//   spaceBetweenAnnotations: PropTypes.number.isRequired,
//   sequenceLength: PropTypes.number.isRequired,
//   featureClicked: PropTypes.func.isRequired
// };

export default Features;
