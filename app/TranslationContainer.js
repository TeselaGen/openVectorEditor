var React = require('react');
var classnames = require('classnames');
var setSelectionLayer = require('./actions/setSelectionLayer');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');
var zeroSubrangeByContainerRange = require('./zeroSubrangeByContainerRange');
var getSequenceWithinRange = require('./getSequenceWithinRange');
var randomColor = require('random-color');
var flatmap = require('flatmap');
var AASliver = require('./AASliver');

var TranslationContainer = React.createClass({
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
      var aminoAcidRepresentationOfTranslation = annotation.aminoAcids;
      var zeroedSubrange = zeroSubrangeByContainerRange(annotationRange, annotation, sequenceLength);
      var aminoAcidsForZeroedSubrange = getSequenceWithinRange(zeroedSubrange, aminoAcidRepresentationOfTranslation);
      var translationSVG = aminoAcidsForZeroedSubrange.map(function (aminoAcid, index) {
        var aminoAcidPositionInSequence = annotationRange.start + index;
        var relativeAAPositionInRow = annotationRange.start % bpsPerRow + index;
        return (
          <AASliver 
                onClick={function (e) {
                  e.stopPropagation();
                  setSelectionLayer({start: aminoAcidPositionInSequence, end: aminoAcidPositionInSequence});
                }}
                key={annotation.id + aminoAcidPositionInSequence}
                forward={false}
                shift={74*relativeAAPositionInRow}
                letter={aminoAcid.aminoAcid.value}
                color={aminoAcid.aminoAcid.color}
                positionInCodon={aminoAcid.positionInCodon}>
          </AASliver>
        );

      });
      // console.log('translationSVG: ' + translationSVG);
      annotationsSVG = annotationsSVG.concat(translationSVG);
      // console.log('annotationsSVG: ' + annotationsSVG);
      // console.log('aminoAcidsForZeroedSubrange: ' + aminoAcidsForZeroedSubrange);


      

      // annotationsSVG.push(<path
      //   key={'directionArrow' + annotation.id + 'start:' + annotationRange.start}
      //   d={createAnnotationArrowRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight)}
      //   stroke={'black'} />);
    });
    // console.log('translationSVG: ' + translationSVG);
    
    var height = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
    return (
      <svg className="annotationContainer" width="105%" height={height} >
        <g transform="scale(.2,.2) ">
        {annotationsSVG}
        </g>
      </svg>
    );

    // function createAnnotationArrowRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight) {
    //   var annotation = annotationRange.annotation;
    //   var xCenter = getXCenterOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
    //   var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
    //   var rangeType = annotationRange.rangeType;
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
    //   if (rangeType === 'beginningAndEnd') {

    //   } else {

    //   }
    //   return path;
    // }

    function createAminoAcidRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight, aminoAcidPositionInSequence) {
      var annotation = annotationRange.annotation;
      var result = getXStartAndWidthOfRowAnnotation({start: aminoAcidPositionInSequence, end: aminoAcidPositionInSequence}, bpsPerRow, charWidth);
      var xStart = result.xStart;
      var width = result.width;
      var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
      var height = annotationHeight;
      var rangeType = annotationRange.rangeType;
      var forward = annotation.forward;
      var xEnd = xStart + width;
      var yEnd = yStart + height;

      if (forward) {

      } else {

      }
      //either "beginning", "end" or "beginningAndEnd"
      if (rangeType === 'beginningAndEnd') {

      } else {

      }
      var path = "M" + xStart + "," + yStart + " L" + xEnd + "," + yStart + " L" + xEnd + "," + yEnd + " L" + xStart + "," + yEnd + " Z";
      return path;
    }

  }
});
module.exports = TranslationContainer;