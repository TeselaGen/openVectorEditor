var React = require('react');
var setSelectionLayer = require('./actions/setSelectionLayer');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var zeroSubrangeByContainerRange = require('./zeroSubrangeByContainerRange');
var getSequenceWithinRange = require('./getSequenceWithinRange');
var AASliver = require('./AASliver');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var TranslationContainer = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function () {
    // var row = this.props.row;
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
      // if (annotationRange.yOffset > 0) { //tnrtodo: consider abstracting out the code to calculate the necessary height for the annotation container
      //   debugger;
      // }
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
                shift={74*relativeAAPositionInRow}
                letter={aminoAcidSliver.aminoAcid.value}
                color={aminoAcidSliver.aminoAcid.color}
                positionInCodon={aminoAcidSliver.positionInCodon}>
          </AASliver>
        );

      });
      // console.log('translationSVG: ' + translationSVG);
      annotationsSVG = annotationsSVG.concat(translationSVG);
      // console.log('annotationsSVG: ' + annotationsSVG);
      // console.log('aminoAcidsForSubrange: ' + aminoAcidsForSubrange);


      

      // annotationsSVG.push(<path
      //   key={'directionArrow' + annotation.id + 'start:' + annotationRange.start}
      //   d={createAnnotationArrowRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight)}
      //   stroke={'black'} />);
    });
    // console.log('translationSVG: ' + translationSVG);
    var transformX = charWidth/75;
    var height = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
    return (
      <svg className="annotationContainer" width="105%" height={height} >
        <g transform={"scale(" + transformX + ",.2) "}>
        {annotationsSVG}
        </g>
      </svg>
    );

    // function createAnnotationArrowRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight) {
    //   var annotation = annotationRange.annotation;
    //   var xCenter = getXCenterOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
    //   var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
    //   var enclosingRangeType = annotationRange.enclosingRangeType;
    //   var forward = annotation.forward;
    //   var xStart = xCenter - charWidth/2;
    //   var xEnd = xCenter + charWidth/2;
    //   var yEnd = yStart + annotationHeight;
    //   var yMiddle = yStart + annotationHeight/2;
    //   var path;
    //   if (forward) {
    //     path = "M" + xStart + "," + yStart + " L" + xEnd + "," + yMiddle + " L" + xStart + "," + yEnd;
    //   } else {

    //   }
    //   //either "beginning", "end" or "beginningAndEnd"
    //   if (enclosingRangeType === 'beginningAndEnd') {

    //   } else {

    //   }
    //   return path;
    // }
    function getCodonIndicesFromAASliver(aminoAcidPositionInSequence,aminoAcidSliver, AARepresentationOfTranslation, relativeAAPositionInTranslation) {
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

    function createAminoAcidRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight, aminoAcidPositionInSequence) {
      var annotation = annotationRange.annotation;
      var result = getXStartAndWidthOfRowAnnotation({start: aminoAcidPositionInSequence, end: aminoAcidPositionInSequence}, bpsPerRow, charWidth);
      var xStart = result.xStart;
      var width = result.width;
      var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
      var height = annotationHeight;
      var enclosingRangeType = annotationRange.enclosingRangeType;
      var forward = annotation.forward;
      var xEnd = xStart + width;
      var yEnd = yStart + height;

      if (forward) {

      } else {

      }
      //either "beginning", "end" or "beginningAndEnd"
      if (enclosingRangeType === 'beginningAndEnd') {

      } else {

      }
      var path = "M" + xStart + "," + yStart + " L" + xEnd + "," + yStart + " L" + xEnd + "," + yEnd + " L" + xStart + "," + yEnd + " Z";
      return path;
    }

  }
});
module.exports = TranslationContainer;