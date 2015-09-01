const React = require('react');
const setSelectionLayer = require('./actions/setSelectionLayer');
const zeroSubrangeByContainerRange = require('./zeroSubrangeByContainerRange');
const getSequenceWithinRange = require('./getSequenceWithinRange');
const AASliver = require('./AASliver');
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const TranslationContainer = React.createClass({
  mixins: [PureRenderMixin],
  render: function () {
    // const row = this.props.row;
    const annotationRanges = this.props.annotationRanges;
    const bpsPerRow = this.props.bpsPerRow;
    const charWidth = this.props.charWidth;
    const annotationHeight = this.props.annotationHeight;
    const spaceBetweenAnnotations = this.props.spaceBetweenAnnotations;
    const sequenceLength = this.props.sequenceLength;
    if (annotationRanges.length === 0) {
      return null;
    }
    const maxAnnotationYOffset = 0;
    const annotationsSVG = [];
    annotationRanges.forEach(function(annotationRange) {
      if (annotationRange.yOffset > maxAnnotationYOffset) { //tnrtodo: consider abstracting out the code to calculate the necessary height for the annotation container
        maxAnnotationYOffset = annotationRange.yOffset;
      }
      const annotation = annotationRange.annotation;
      //we have an amino acid representation of our entire annotation, but it is an array 
      //starting at 0, even if the annotation starts at some arbitrary point in the sequence
      const AARepresentationOfTranslation = annotation.aminoAcids;
      //so we "zero" our subRange by the annotation start
      const zeroedSubrange = zeroSubrangeByContainerRange(annotationRange, annotation, sequenceLength);
      //which allows us to then get the amino acids for the subRange
      const aminoAcidsForSubrange = getSequenceWithinRange(zeroedSubrange, AARepresentationOfTranslation);
      //we then loop over all the amino acids in the sub range and draw them onto the row
      const translationSVG = aminoAcidsForSubrange.map(function (aminoAcidSliver, index) {
        const aminoAcidPositionInSequence = annotationRange.start + index;
        const relativeAAPositionInRow = annotationRange.start % bpsPerRow + index;
        const relativeAAPositionInTranslation = zeroedSubrange.start + index;

        //get the codonIndices relative to 
        const codonIndices = getCodonIndicesFromAASliver(aminoAcidPositionInSequence, aminoAcidSliver, AARepresentationOfTranslation, relativeAAPositionInTranslation);
        return (
          <AASliver 
                onClick={function (e) {
                  e.stopPropagation();
                  setSelectionLayer(codonIndices);
                }}
                key={annotation.id + aminoAcidPositionInSequence}
                forward={false}
                shift={74*relativeAAPositionInRow}
                letter={aminoAcidSliver.aminoAcid.value}
                color={aminoAcidSliver.aminoAcid.color}
                positionInCodon={aminoAcidSliver.positionInCodon}>
          </AASliver>
        );
      });
      // console.log('translationSVG: ' + translationSVG);
      annotationsSVG = annotationsSVG.concat(translationSVG);
    });
    const transformX = charWidth/75;
    const height = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
    return (
      <svg className="annotationContainer" width="105%" height={height} >
        <g transform={"scale(" + transformX + ",.2) "}>
        {annotationsSVG}
        </g>
      </svg>
    );

    function getCodonIndicesFromAASliver(aminoAcidPositionInSequence,aminoAcidSliver, AARepresentationOfTranslation, relativeAAPositionInTranslation) {
          const AASliverOneBefore = AARepresentationOfTranslation[relativeAAPositionInTranslation - 1];
          if (AASliverOneBefore && AASliverOneBefore.aminoAcidIndex === aminoAcidSliver.aminoAcidIndex) {
            const AASliverTwoBefore = AARepresentationOfTranslation[relativeAAPositionInTranslation - 2];
            if (AASliverTwoBefore && AASliverTwoBefore.aminoAcidIndex === aminoAcidSliver.aminoAcidIndex) {
              return {
                start: aminoAcidPositionInSequence - 2,
                end: aminoAcidPositionInSequence
              };
            } else {
              if (aminoAcidSliver.fullCodon === true) {
                return {
                  start: aminoAcidPositionInSequence - 1,
                  end: aminoAcidPositionInSequence + 1
                };
              } else {
                return {
                  start: aminoAcidPositionInSequence - 1,
                  end: aminoAcidPositionInSequence
                };
              }
            }
          } else {
            //no AASliver before with same index
            if (aminoAcidSliver.fullCodon === true) {
              //sliver is part of a full codon, so we know the codon will expand 2 more slivers ahead
              return {
                start: aminoAcidPositionInSequence,
                end: aminoAcidPositionInSequence + 2
              };
            } else {
              const AASliverOneAhead = AARepresentationOfTranslation[relativeAAPositionInTranslation - 2];
              if (AASliverOneAhead && AASliverOneAhead.aminoAcidIndex === aminoAcidSliver.aminoAcidIndex) {
                return {
                  start: aminoAcidPositionInSequence,
                  end: aminoAcidPositionInSequence + 1
                };
              } else {
                return {
                  start: aminoAcidPositionInSequence,
                  end: aminoAcidPositionInSequence + 1
                };
              }
            }
          }
        }

  }
});
module.exports = TranslationContainer;