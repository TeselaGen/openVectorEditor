import pureNoFunc from "../../utils/pureNoFunc";
import forEach from "lodash/forEach";
import React from "react";

// import './style.css'
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

import { getAnnotationRangeType } from "ve-range-utils";
import Guide from "./Guide";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";

function Guides(props) {
  let {
    annotationRanges = [],
    bpsPerRow,
    charWidth,
    annotationHeight = 12,
    spaceBetweenAnnotations = 2,
    guideClicked,
    guideRightClicked,
    editorName,
    getGaps,
    marginTop = 10
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
    const { gapsBefore, gapsInside } = getGaps(annotationRange);
    let annotation = annotationRange.annotation;
    let annotationColor = "purple";
    let result = getXStartAndWidthOfRowAnnotation(
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
        <Guide
          key={index}
          editorName={editorName}
          id={annotation.id}
          guideClicked={guideClicked}
          guideRightClicked={guideRightClicked}
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
          name={Math.round(annotation.onTargetScore)}
        />
      </AnnotationPositioner>
    );
  });
  let containerHeight =
    (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
  return (
    <AnnotationContainerHolder
      marginTop={marginTop}
      className={"veRowViewGuideContainer"}
      containerHeight={containerHeight}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

// Guides.propTypes = {
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
//   guideClicked: PropTypes.func.isRequired
// };

export default pureNoFunc(Guides);
