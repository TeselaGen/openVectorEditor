import { featureColors } from "ve-sequence-utils";
import { camelCase } from "lodash";
import pureNoFunc from "../../utils/pureNoFunc";
import "./style.css";
import forEach from "lodash/forEach";
import React from "react";

// import './style.css'
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

import { getAnnotationRangeType } from "ve-range-utils";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";
import PointedAnnotation from "./PointedAnnotation";

function StackedAnnotations(props) {
  let {
    annotationRanges = [],
    bpsPerRow,
    charWidth,
    containerClassName,
    annotationHeight,
    spaceBetweenAnnotations,
    onClick,
    disregardLocations,
    InnerComp,
    onRightClick,
    editorName,
    type,
    alignmentType,
    getGaps,
    marginTop,
    marginBottom,
    getExtraInnerCompProps
  } = props;

  const InnerCompToUse = InnerComp || PointedAnnotation;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  forEach(annotationRanges, function(annotationRange, index) {
    if (annotationRange.yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = annotationRange.yOffset;
    }
    let { gapsBefore, gapsInside } = getGaps(annotationRange);
    if (alignmentType === "Parallel Part Creation") {
      gapsBefore = 0;
      gapsInside = 0;
    }
    let annotation = annotationRange.annotation;
    let annotationColor =
      annotation.color ||
      (annotation.type && featureColors[annotation.type]) ||
      "#BBBBBB";
    let result = getXStartAndWidthOfRowAnnotation(
      annotationRange,
      bpsPerRow,
      charWidth,
      gapsBefore,
      gapsInside
    );
    let top = annotationRange.yOffset * annotationHeight;
    if (!disregardLocations && annotationRange.containsLocations) {
      top += annotationHeight / 2 - annotationHeight / 16;
    }
    const anotationHeightNoSpace = annotationHeight - spaceBetweenAnnotations;

    annotationsSVG.push(
      <AnnotationPositioner
        height={anotationHeightNoSpace}
        width={result.width}
        key={index}
        top={top}
        left={result.xStart}
      >
        <InnerCompToUse
          key={index}
          className={camelCase("veRowView-" + type)}
          editorName={editorName}
          id={annotation.id}
          onClick={onClick}
          type={type}
          onRightClick={onRightClick}
          annotation={annotation}
          gapsInside={gapsInside}
          gapsBefore={gapsBefore}
          color={annotationColor}
          width={result.width}
          widthInBps={annotationRange.end - annotationRange.start + 1}
          charWidth={charWidth}
          forward={annotation.forward}
          rangeType={getAnnotationRangeType(
            annotationRange,
            annotation,
            annotation.forward
          )}
          height={
            annotationRange.containsLocations && !disregardLocations
              ? anotationHeightNoSpace / 8
              : anotationHeightNoSpace
          }
          hideName={annotationRange.containsLocations && !disregardLocations}
          name={annotation.name}
          {...getExtraInnerCompProps &&
            getExtraInnerCompProps(annotationRange, props)}
        />
      </AnnotationPositioner>
    );
  });

  let containerHeight = (maxAnnotationYOffset + 1) * annotationHeight;
  return (
    <AnnotationContainerHolder
      marginTop={marginTop}
      marginBottom={marginBottom}
      className={containerClassName}
      containerHeight={containerHeight}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

export default pureNoFunc(StackedAnnotations);
