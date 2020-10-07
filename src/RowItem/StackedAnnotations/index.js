import { featureColors } from "ve-sequence-utils";
import { camelCase } from "lodash";
import classnames from "classnames";
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
    isProtein,

    onDoubleClick,
    disregardLocations,
    InnerComp,
    onRightClick,
    editorName,
    type,
    noRedux,
    alignmentType,
    getGaps,
    marginTop,
    marginBottom,
    getExtraInnerCompProps,
    onlyShowLabelsThatDoNotFit,
    externalLabels
  } = props;

  const InnerCompToUse = InnerComp || PointedAnnotation;
  if (annotationRanges.length === 0) {
    return null;
  }
  let maxAnnotationYOffset = 0;
  let annotationsSVG = [];
  forEach(annotationRanges, function (annotationRange, index) {
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
          noRedux={noRedux}
          externalLabels={externalLabels}
          key={index}
          className={classnames(
            `${camelCase("veRowView-" + type)}`,
            annotation.className
          )}
          editorName={editorName}
          id={annotation.id}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          type={type}
          onRightClick={onRightClick}
          annotation={annotation}
          isProtein={isProtein}
          gapsInside={gapsInside}
          gapsBefore={gapsBefore}
          color={annotationColor}
          width={result.width}
          widthInBps={annotationRange.end - annotationRange.start + 1}
          charWidth={charWidth}
          forward={annotation.forward}
          onlyShowLabelsThatDoNotFit={onlyShowLabelsThatDoNotFit}
          rangeType={
            annotation.noDirectionality
              ? "middle"
              : getAnnotationRangeType(
                  annotationRange,
                  annotation,
                  annotation.forward
                )
          }
          {...(annotation.noDirectionality && { pointiness: 0 })}
          height={
            annotationRange.containsLocations && !disregardLocations
              ? anotationHeightNoSpace / 8
              : anotationHeightNoSpace
          }
          hideName={annotationRange.containsLocations && !disregardLocations}
          name={annotation.name}
          {...(getExtraInnerCompProps &&
            getExtraInnerCompProps(annotationRange, props))}
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
