import React from "react";
import useAAColorType from "../../utils/useAAColorType";
import StackedAnnotations from "../StackedAnnotations";
import Translation from "./Translation";

function getExtraInnerCompProps(
  annotationRange,
  {
    showAminoAcidNumbers,
    getGaps,
    isProtein,
    colorType,
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
    colorType,
    sequenceLength
  };
}

function Translations(props) {
  const [colorType] = useAAColorType();
  return (
    <StackedAnnotations
      {...{
        ...props,
        annotationRanges: props.annotationRanges.filter(
          (t) => !t.isJoinedLocation
        ),
        annotationHeight:
          props.annotationHeight +
          (props.showAminoAcidNumbers ? props.aminoAcidNumbersHeight : 0),
        disregardLocations: true,
        getExtraInnerCompProps,
        InnerComp: Translation,
        colorType
      }}
    />
  );
}

export default Translations;
