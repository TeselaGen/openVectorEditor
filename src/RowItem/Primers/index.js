import Sequence from "../Sequence";
import getSequenceWithinRange from "ve-range-utils/getSequenceWithinRange";
import "./style.css";
import forEach from "lodash/forEach";
import PropTypes from "prop-types";
import React from "react";

// import './style.css'
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

import getAnnotationRangeType from "ve-range-utils/getAnnotationRangeType";
import Primer from "./Primer";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";

function Primers(props) {
  let {
    annotationRanges = [],
    bpsPerRow,
    charWidth,
    annotationHeight = 12,
    spaceBetweenAnnotations = 2,
    primerClicked,
    primerRightClicked,
    HoverHelper,

    sequence = ""
  } = props;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  forEach(annotationRanges, function(annotationRange, index) {
    let seqInRow = getSequenceWithinRange(annotationRange, sequence);
    if (annotationRange.yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = annotationRange.yOffset;
    }
    let annotation = annotationRange.annotation;
    let result = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth
    );
    annotationsSVG.push(
      <HoverHelper
        passJustOnMouseOverAndClassname
        // onHover={function () {
        //     debugger
        // }}
        key={"primer" + index}
        id={annotation.id}
      >
        <div onClick={function() {}}>
          <AnnotationPositioner
            height={annotationHeight}
            width={result.width}
            key={index}
            top={
              annotationRange.yOffset *
              (annotationHeight + spaceBetweenAnnotations)
            }
            left={result.xStart}
          >
            <Primer
              key={index}
              primerClicked={primerClicked}
              primerRightClicked={primerRightClicked}
              annotation={annotation}
              color={annotation.color}
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
        </div>
      </HoverHelper>
    );
  });
  let containerHeight =
    (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);

  return (
    <AnnotationContainerHolder
      className={"veRowViewPrimerContainer"}
      containerHeight={containerHeight}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

Primers.propTypes = {
  annotationRanges: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      yOffset: PropTypes.number.isRequired,
      annotation: PropTypes.shape({
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        forward: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired
      })
    })
  ),
  charWidth: PropTypes.number.isRequired,
  bpsPerRow: PropTypes.number.isRequired,
  annotationHeight: PropTypes.number.isRequired,
  spaceBetweenAnnotations: PropTypes.number.isRequired,
  sequenceLength: PropTypes.number.isRequired,
  primerClicked: PropTypes.func.isRequired
};

export default Primers;

// <Sequence
//     key={index}
//     sequence={seqInRow}
//     startOffset={startOffset}
//     height={height}
//     containerStyle={{
//         marginTop: 8,
//         marginBottom: 6,
//     }}
//     length={seqInRow.length}
//     charWidth={charWidth}>
//     <svg style={{left: startOffset * charWidth, height: annotationHeight, position: 'absolute'}}
//         ref="rowViewTextContainer"
//         onClick={function (event) {
//           primerClicked({event, annotation})
//         }}
//         onContextMenu={function (event) {
//           primerRightClicked({event, annotation})
//         }}
//         className="rowViewTextContainer clickable" width={width} height={height}>
//         <polyline
//           points={`${-bufferLeft},0 ${-bufferLeft},${-arrowHeight}, ${charWidth/2},0 ${width},0 ${width},${height + bufferBottom} ${-bufferLeft},${height + bufferBottom} ${-bufferLeft},0`}
//           fill="none"
//           stroke={color}
//           strokeWidth="2px"/>
//     </svg>
// </Sequence>
