import React from "react";
import {
  getSequenceWithinRange,
  zeroSubrangeByContainerRange
} from "ve-range-utils";
import { onlyUpdateForKeys } from "recompose";
import AASliver from "./AASliver";

class Translation extends React.Component {
  // shouldComponentUpdate(newProps){
  //   const eq = (isEqual(newProps, this.props))
  //   return eq
  // }
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
      charWidth,
      translationClicked,
      translationRightClicked,
      translationDoubleClicked,
      sequenceLength,
      getGaps
    } = this.props;
    const { hasMounted } = this.state;

    let { annotation } = annotationRange;
    if (!hasMounted) {
      return <g height={height} className={"translationLayer"} />;
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
      // var relativeAAPositionInTranslation = annotationRange.start % bpsPerRow + index;
      let relativeAAPositionInTranslation = index;
      //get the codonIndices relative to
      return (
        <AASliver
          onClick={function(event) {
            translationClicked({
              annotation,
              codonRange: aminoAcidSliver.codonRange,
              event
            });
          }}
          onContextMenu={function(event) {
            translationRightClicked({
              annotation,
              codonRange: aminoAcidSliver.codonRange,
              event
            });
          }}
          title={`${
            aminoAcidSliver.aminoAcid.name
          } -- Index: ${aminoAcidSliver.aminoAcidIndex + 1} -- Hydrophobicity ${
            aminoAcidSliver.aminoAcid.hydrophobicity
          }`}
          onDoubleClick={function(event) {
            translationDoubleClicked({ annotation, event });
          }}
          getGaps={getGaps}
          key={annotation.id + aminoAcidSliver.sequenceIndex}
          forward={annotation.forward}
          width={
            charWidth *
            (getGaps && aminoAcidSliver.positionInCodon === 1
              ? getGaps(aminoAcidSliver.codonRange).gapsInside || 1
              : 1)
          }
          height={height}
          relativeAAPositionInTranslation={relativeAAPositionInTranslation}
          letter={aminoAcidSliver.aminoAcid.value}
          color={aminoAcidSliver.aminoAcid.color}
          positionInCodon={aminoAcidSliver.positionInCodon}
        />
      );
    });

    return (
      <g
        className={"translationLayer"}
        // onClick={this.props.translationClicked}
      >
        {translationSVG}
      </g>
    );
  }
}

// Translation.propTypes = {
//   widthInBps: PropTypes.number.isRequired,
//   charWidth: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   rangeType: PropTypes.string.isRequired,
//   translationClicked: PropTypes.func.isRequired
// };
// export default Translation
export default onlyUpdateForKeys([
  "annotationRange",
  "height",
  "charWidth",
  "sequenceLength"
])(Translation);
