import React from "react";
import {
  getSequenceWithinRange,
  zeroSubrangeByContainerRange
} from "ve-range-utils";
import AASliver from "./AASliver";
import pureNoFunc from "../../utils/pureNoFunc";

class Translation extends React.Component {
  state = {
    hasMounted: false
  };
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({
        hasMounted: true
      });
    }, 5);
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    let {
      annotationRange,
      height,
      showAminoAcidNumbers,
      charWidth,
      aminoAcidNumbersHeight,
      onClick,
      onRightClick,
      onDoubleClick,
      sequenceLength,
      getGaps,
      isProtein
    } = this.props;
    const { hasMounted } = this.state;
    let { annotation } = annotationRange;
    if (!hasMounted && !isProtein) {
      return <g height={height} className="translationLayer" />;
    }
    //we have an amino acid representation of our entire annotation, but it is an array
    //starting at 0, even if the annotation starts at some arbitrary point in the sequence
    let { aminoAcids = [] } = annotation;
    //so we "zero" our subRange by the annotation start
    let subrangeStartRelativeToAnnotationStart = zeroSubrangeByContainerRange(
      annotationRange,
      annotation,
      sequenceLength
    );
    //which allows us to then get the amino acids for the subRange
    let aminoAcidsForSubrange = getSequenceWithinRange(
      subrangeStartRelativeToAnnotationStart,
      aminoAcids
    );

    //we then loop over all the amino acids in the sub range and draw them onto the row
    let translationSVG = aminoAcidsForSubrange.map(function(
      aminoAcidSliver,
      index
    ) {
      const isEndFiller =
        index === 0 &&
        aminoAcidSliver.positionInCodon === (annotation.forward ? 2 : 0);
      // const isStartFiller = false
      let isTruncatedEnd = index === 0 && aminoAcidSliver.positionInCodon === 1;
      let isTruncatedStart =
        index === aminoAcidsForSubrange.length - 1 &&
        aminoAcidSliver.positionInCodon === 1;
      if (!annotation.forward) {
        const holder = isTruncatedEnd;
        isTruncatedEnd = isTruncatedStart;
        isTruncatedStart = holder;
      }
      const isStartFiller =
        index === aminoAcidsForSubrange.length - 1 &&
        aminoAcidSliver.positionInCodon === (annotation.forward ? 0 : 2);

      if (
        aminoAcidSliver.positionInCodon !== 1 &&
        !isStartFiller &&
        !isEndFiller
      ) {
        return null;
      }
      const { gapsInside, gapsBefore } = getGaps(aminoAcidSliver.codonRange);
      const gapsInsideFeatureStartToBp = getGaps({
        start: annotationRange.start,
        end: aminoAcidSliver.sequenceIndex
      }).gapsInside;
      // var relativeAAPositionInTranslation = annotationRange.start % bpsPerRow + index;
      let relativeAAPositionInTranslation = index;
      const aminoAcid = aminoAcidSliver.aminoAcid || {};
      //get the codonIndices relative to
      return (
        <AASliver
          isFiller={isEndFiller || isStartFiller}
          isTruncatedEnd={isTruncatedEnd}
          isTruncatedStart={isTruncatedStart}
          onClick={function(event) {
            onClick({
              annotation: aminoAcidSliver.codonRange,
              codonRange: aminoAcidSliver.codonRange,
              event,
              gapsInside,
              gapsBefore
            });
          }}
          onContextMenu={function(event) {
            onRightClick &&
              onRightClick({
                annotation,
                codonRange: aminoAcidSliver.codonRange,
                event,
                gapsInside,
                gapsBefore
              });
          }}
          title={`${aminoAcid.name} -- Index: ${aminoAcidSliver.aminoAcidIndex +
            1} -- Hydrophobicity ${aminoAcid.hydrophobicity}`}
          showAminoAcidNumbers={showAminoAcidNumbers}
          aminoAcidIndex={aminoAcidSliver.aminoAcidIndex}
          onDoubleClick={function(event) {
            onDoubleClick({ annotation, event });
          }}
          getGaps={getGaps}
          key={annotation.id + aminoAcidSliver.sequenceIndex}
          forward={annotation.forward}
          width={charWidth}
          height={
            showAminoAcidNumbers ? height - aminoAcidNumbersHeight : height
          }
          relativeAAPositionInTranslation={
            relativeAAPositionInTranslation + gapsInsideFeatureStartToBp
          }
          letter={aminoAcid.value}
          color={aminoAcid.color}
          positionInCodon={aminoAcidSliver.positionInCodon}
        />
      );
    });

    return <g className="translationLayer">{translationSVG}</g>;
  }
}

export default pureNoFunc(Translation);
