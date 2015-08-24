var React = require('react');
var setSelectionLayer = require('./actions/setSelectionLayer');
var zeroSubrangeByContainerRange = require('./zeroSubrangeByContainerRange');
var getSequenceWithinRange = require('./getSequenceWithinRange');
var AASliver = require('./AASliver');

var AnnotationContainerHolder = require('./AnnotationContainerHolder');
var AnnotationPositioner = require('./AnnotationPositioner');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');

var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var TranslationContainer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        annotationHeight: React.PropTypes.number.isRequired,
        spaceBetweenAnnotations: React.PropTypes.number.isRequired,
    },
    render: function () {
          var annotationRanges = this.props.annotationRanges;
          var bpsPerRow = this.props.bpsPerRow;
          var charWidth = this.props.charWidth;
          var annotationHeight = this.props.annotationHeight;
          var spaceBetweenAnnotations = this.props.spaceBetweenAnnotations;
          var sequenceLength = this.props.sequenceLength;
          if (annotationRanges.length === 0) {
            return null;
          }
          var maxAnnotationYOffset = 0;
          var annotationsSVG = [];
          annotationRanges.forEach(function(annotationRange) {
            if (annotationRange.yOffset > maxAnnotationYOffset) { //tnrtodo: consider abstracting out the code to calculate the necessary height for the annotation container
              maxAnnotationYOffset = annotationRange.yOffset;
            }
            var annotation = annotationRange.annotation;
            //we have an amino acid representation of our entire annotation, but it is an array 
            //starting at 0, even if the annotation starts at some arbitrary point in the sequence
            var AARepresentationOfTranslation = annotation.aminoAcids;
            //so we "zero" our subRange by the annotation start
            var zeroedSubrange = zeroSubrangeByContainerRange(annotationRange, annotation, sequenceLength);
            //which allows us to then get the amino acids for the subRange
            var aminoAcidsForSubrange = getSequenceWithinRange(zeroedSubrange, AARepresentationOfTranslation);
            //we then loop over all the amino acids in the sub range and draw them onto the row
            var translationSVG = aminoAcidsForSubrange.map(function (aminoAcidSliver, index) {
              var aminoAcidPositionInSequence = annotationRange.start + index;
              var relativeAAPositionInRow = annotationRange.start % bpsPerRow + index;
              var relativeAAPositionInTranslation = zeroedSubrange.start + index;

              //get the codonIndices relative to 
              var codonIndices = getCodonIndicesFromAASliver(aminoAcidPositionInSequence, aminoAcidSliver, AARepresentationOfTranslation, relativeAAPositionInTranslation);
              return (
                  <AASliver 
                        onClick={function (e) {
                          e.stopPropagation();
                          setSelectionLayer(codonIndices);
                        }}
                        key={annotation.id + aminoAcidPositionInSequence}
                        forward={false}
                        width={charWidth}
                        height={annotationHeight}
                        relativeAAPositionInRow={relativeAAPositionInRow}
                        letter={aminoAcidSliver.aminoAcid.value}
                        color={aminoAcidSliver.aminoAcid.color}
                        positionInCodon={aminoAcidSliver.positionInCodon}>
                  </AASliver>
              );
            });
            
            var result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner 
                  height={annotationHeight} 
                  width={result.width}
                  key={'feature' + annotation.id + 'start:' + annotationRange.start}
                  top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                  left={result.xStart}
                  >
                    <g>
                      {translationSVG}
                    </g>
                </AnnotationPositioner>
            );
            // transform={"scale(" + transformX + ",.2) "}
            // console.log('translationSVG: ' + translationSVG);
            // annotationsSVG = annotationsSVG.concat(translationSVG);
          });
          var containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
          // height={containerHeight}
          return (
              <AnnotationContainerHolder 
                containerHeight={containerHeight}>
                {annotationsSVG}
              </AnnotationContainerHolder>
          );

          function getCodonIndicesFromAASliver(aminoAcidPositionInSequence, aminoAcidSliver, AARepresentationOfTranslation, relativeAAPositionInTranslation) {
              var AASliverOneBefore = AARepresentationOfTranslation[relativeAAPositionInTranslation - 1];
              if (AASliverOneBefore && AASliverOneBefore.aminoAcidIndex === aminoAcidSliver.aminoAcidIndex) {
                  var AASliverTwoBefore = AARepresentationOfTranslation[relativeAAPositionInTranslation - 2];
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
                      var AASliverOneAhead = AARepresentationOfTranslation[relativeAAPositionInTranslation - 2];
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