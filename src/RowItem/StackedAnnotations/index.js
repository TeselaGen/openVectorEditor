import { getFeatureToColorMap } from "ve-sequence-utils";
import pureNoFunc from "../../utils/pureNoFunc";
import "./style.css";
import forEach from "lodash/forEach";
import React from "react";
import IntervalTree from "node-interval-tree";
import getXStartAndWidthOfRowAnnotation from "../getXStartAndWidthOfRowAnnotation";

import { getAnnotationRangeType } from "ve-range-utils";
import AnnotationContainerHolder from "../AnnotationContainerHolder";
import AnnotationPositioner from "../AnnotationPositioner";
import PointedAnnotation from "./PointedAnnotation";
import { getBasesToShow } from "./primerBases";

function StackedAnnotations(props) {
  const {
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
    readOnly,
    noRedux,
    alignmentType,
    getGaps,
    marginTop,
    sequenceLength,
    // sequence: fullSeq,
    fullSequence,
    marginBottom,
    truncateLabelsThatDoNotFit,
    getExtraInnerCompProps,
    onlyShowLabelsThatDoNotFit,
    isStriped
  } = props;

  const iTree = new IntervalTree(Math.ceil(bpsPerRow / 2));
  const InnerCompToUse = InnerComp || PointedAnnotation;
  if (annotationRanges.length === 0) {
    return null;
  }

  let maxAnnotationYOffset = 0;
  const annotationsSVG = [];
  let extraHeightForContainer = 0;
  forEach(annotationRanges, function (annotationRange, index) {
    if (annotationRange.yOffset > maxAnnotationYOffset) {
      maxAnnotationYOffset = annotationRange.yOffset;
    }
    let { gapsBefore, gapsInside } = getGaps(annotationRange);
    if (alignmentType === "Parallel Part Creation") {
      gapsBefore = 0;
      gapsInside = 0;
    }
    const annotation = annotationRange.annotation;
    const annotationColor =
      annotation.color ||
      (annotation.type &&
        getFeatureToColorMap({ includeHidden: true })[annotation.type]) ||
      "#BBBBBB";
    const result = getXStartAndWidthOfRowAnnotation(
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

    const {
      baseEl,
      extraHeight = 0,
      insertPaths,
      insertTicks,
      flipAnnotation
    } = getBasesToShow({
      hidePrimerBases: charWidth < 8,
      sequenceLength,
      iTree,
      fullSequence,
      annotation,
      annotationRange,
      charWidth,
      bpsPerRow
    });

    const anotationHeightNoSpace = annotationHeight - spaceBetweenAnnotations;
    extraHeightForContainer += extraHeight;
    annotationsSVG.push(
      <AnnotationPositioner
        yOffset={annotationRange.yOffset}
        height={anotationHeightNoSpace + extraHeight}
        width={result.width}
        key={index}
        top={top}
        left={result.xStart}
      >
        <InnerCompToUse
          noRedux={noRedux}
          key={index}
          className={annotation.className}
          arrowheadType={annotation.arrowheadType}
          editorName={editorName}
          id={annotation.id}
          fivePrimeOverhang={annotation.fivePrimeOverhang}
          fivePrimeUnderhang={annotation.fivePrimeUnderhang}
          fivePrimeDigestingEnzyme={annotation.fivePrimeDigestingEnzyme}
          threePrimeOverhang={annotation.threePrimeOverhang}
          threePrimeUnderhang={annotation.threePrimeUnderhang}
          threePrimeDigestingEnzyme={annotation.threePrimeDigestingEnzyme}
          onClick={onClick}
          truncateLabelsThatDoNotFit={truncateLabelsThatDoNotFit}
          insertPaths={insertPaths}
          insertTicks={insertTicks}
          onDoubleClick={onDoubleClick}
          type={type}
          readOnly={readOnly}
          flipAnnotation={flipAnnotation}
          extraHeight={extraHeight}
          onRightClick={onRightClick}
          annotation={annotation}
          isProtein={isProtein}
          isStriped={isStriped}
          gapsInside={gapsInside}
          gapsBefore={gapsBefore}
          color={annotationColor}
          width={result.width}
          annotationRange={annotationRange}
          widthInBps={annotationRange.end - annotationRange.start + 1}
          charWidth={charWidth}
          forward={annotation.forward}
          onlyShowLabelsThatDoNotFit={onlyShowLabelsThatDoNotFit}
          rangeType={getAnnotationRangeType(
            annotationRange,
            annotation,
            annotation.forward
          )}
          {...(annotation.bases && { pointiness: 3, arrowPointiness: 0.2 })}
          height={
            annotationRange.containsLocations && !disregardLocations
              ? anotationHeightNoSpace / 8
              : anotationHeightNoSpace
          }
          hideName={
            (type === "primer" && annotation.bases) ||
            (annotationRange.containsLocations && !disregardLocations)
          }
          name={annotation.name}
          {...(getExtraInnerCompProps &&
            getExtraInnerCompProps(annotationRange, props))}
        />
        {baseEl}
      </AnnotationPositioner>
    );
  });

  const containerHeight = (maxAnnotationYOffset + 1) * annotationHeight;
  return (
    <AnnotationContainerHolder
      marginTop={marginTop}
      marginBottom={marginBottom}
      className={containerClassName}
      containerHeight={containerHeight}
      extraMargin={extraHeightForContainer}
    >
      {annotationsSVG}
    </AnnotationContainerHolder>
  );
}

export default pureNoFunc(StackedAnnotations);
