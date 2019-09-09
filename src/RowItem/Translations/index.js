import React from "react";
import StackedAnnotations from "../StackedAnnotations";
import Translation from "./Translation";

function getExtraInnerCompProps(
  annotationRange,
  {
    showAminoAcidNumbers,
    getGaps,
    isProtein,
    annotationHeight,
    spaceBetweenAnnotations,
    sequenceLength,
    aminoAcidNumbersHeight
  }
) {
  const anotationHeightNoSpace = annotationHeight - spaceBetweenAnnotations;

  return {
    showAminoAcidNumbers,
    getGaps,
    height: anotationHeightNoSpace,
    aminoAcidNumbersHeight,
    annotationRange,
    isProtein,
    sequenceLength
  };
}

function Translations(props) {
  return (
    <StackedAnnotations
      {...{
        ...props,
        annotationRanges: props.annotationRanges.filter(
          t => !t.isJoinedLocation
        ),
        annotationHeight:
          props.annotationHeight +
          (props.showAminoAcidNumbers ? props.aminoAcidNumbersHeight : 0),
        disregardLocations: true,
        getExtraInnerCompProps,
        InnerComp: Translation
      }}
    />
  );
}

export default Translations;
