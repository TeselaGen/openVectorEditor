import pureNoFunc from "../../utils/pureNoFunc";
import "./style.css";
// import PropTypes from "prop-types";
import React from "react";
import { getAnnotationRangeType } from "ve-range-utils";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";
import Translation from "./Translation";
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

function Translations(props) {
  let {
    annotationRanges,
    bpsPerRow,
    charWidth,
    isProtein,
    annotationHeight,
    spaceBetweenAnnotations,
    getGaps,
    ...rest
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  const annotationsSVG = [];
  annotationRanges.forEach(function(annotationRange) {
    if (annotationRange.isJoinedLocation) return; //filter out joined locations, just show the overarching translation for CDS features ()
    if (annotationRange.yOffset > maxAnnotationYOffset) {
      //TODO: consider abstracting out the code to calculate the necessary height for the annotation container
      maxAnnotationYOffset = annotationRange.yOffset;
    }
    const annotation = annotationRange.annotation;
    const { gapsBefore, gapsInside } = getGaps(annotationRange);
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
        className={
          "veRowViewTranslations " +
          (isProtein ? " primaryProteinSequence" : "")
        }
        key={
          "ve-translation-" + annotation.id + "start:" + annotationRange.start
        }
        top={
          annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)
        }
        left={result.xStart}
      >
        <Translation
          isProtein={isProtein}
          annotationRange={annotationRange}
          rangeType={getAnnotationRangeType(
            annotationRange,
            annotation,
            annotation.forward
          )}
          {...getGaps(annotationRange)}
          getGaps={getGaps}
          widthInBps={annotationRange.end - annotationRange.start + 1}
          charWidth={charWidth}
          height={annotationHeight}
          {...rest}
        />
      </AnnotationPositioner>
    );
    // transform={"scale(" + transformX + ",.2) "}
    // annotationsSVG = annotationsSVG.concat(translationSVG);
  });
  const containerHeight =
    (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
  // height={containerHeight}
  return (
    <AnnotationContainerHolder containerHeight={containerHeight}>
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

// Translations.propTypes = {
//   annotationRanges: PropTypes.arrayOf(
//     PropTypes.shape({
//       start: PropTypes.number.isRequired,
//       end: PropTypes.number.isRequired,
//       yOffset: PropTypes.number.isRequired,
//       annotation: PropTypes.shape({
//         start: PropTypes.number.isRequired,
//         end: PropTypes.number.isRequired,
//         forward: PropTypes.bool.isRequired,
//         id: PropTypes.string.isRequired
//       })
//     })
//   ),
//   charWidth: PropTypes.number.isRequired,
//   bpsPerRow: PropTypes.number.isRequired,
//   annotationHeight: PropTypes.number.isRequired,
//   spaceBetweenAnnotations: PropTypes.number.isRequired,
//   sequenceLength: PropTypes.number.isRequired
// };

export default pureNoFunc(Translations);
