var React = require('react');
var classnames = require('classnames');
var setSelectionLayer = require('./actions/setSelectionLayer');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');
var baobabBranch = require('baobab-react/mixins').branch;

var TranslationContainer = React.createClass({
  mixins: [baobabBranch],
  render: function () {
    var row = this.props.row;
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
    return null;
    debugger;

    

    function getAminoAcidsForSubsectionOfTranslation(sequenceLength, rangeSubsection, fullTranslationRange, forward) {
      var comparisonRange;
      if (fullTranslationRange.start > fullTranslationRange.end) { //circular fullTranslationRange
        //0 to fullTranslationRange.start needs to be shifted
        if (rangeSubsection.start < fullTranslationRange.start) {
          comparisonRange.start = rangeSubsection.start + sequenceLength;
        } else {
          comparisonRange.start = rangeSubsection.start;
        }
        if (rangeSubsection.end < fullTranslationRange.start) {
          comparisonRange.end = rangeSubsection.end + sequenceLength;
        } else {
          comparisonRange.end = rangeSubsection.end;
        }
      } else {
        comparisonRange.start = rangeSubsection.start;
        comparisonRange.end = rangeSubsection.end;
      }
      if (!forward) {
        //we'll flip the range 
        flipRangeAroundPivotPoint(comparisonRange, sequenceLength);
      }
      return aminoAcidRepresentationOfSequence;
    }

    annotationRanges.forEach(function(annotationRange) {

      if (annotationRange.yOffset > maxAnnotationYOffset) { //tnrtodo: consider abstracting out the code to calculate the necessary height for the annotation container
        maxAnnotationYOffset = annotationRange.yOffset;
      }
      var annotation = annotationRange.annotation;
      var aminoAcidsForSubsectionOfTranslation = getAminoAcidsForSubsectionOfTranslation(sequenceLength, annotationRange, annotation, aminoAcidRepresentationOfSequence);

      //based on the orf start, its frame, and whether or not it's forward
      //we should be able to compute the amino acid frame for the row
      //
      var comparisonStart;
      var comparisonEnd;
      if (annotation.start > annotation.end) {
        if (annotationRange.start > annotation.start) {
          comparisonStart = annotationRange.start - annotation.start;
        } else {
          comparisonStart = annotation.start - annotationRange.start;
        }
      } else {
        comparisonStart = annotationRange.start;
        comparisonEnd = annotationRange.end;
      }

      if (annotation.forward) {
        var annotationRangeFrame;
        if (annotationRange.start > annotation.start) {
          annotationRangeFrame = (annotationRange.start - annotation.start)%3;
        } else {
          annotationRangeFrame = (annotation.start - annotationRange.start)%3;
        }
        function yargh (sequence) {
          //we now need to get a mapping of the sequence to the amino acids they form
          for (var i = annotationRangeFrame + annotationRange.start; i < annotationRange.end; i+=3) {
            
          }
        }
        row.sequence;
      } else {
        
      }
      
      
      if (annotation.start > annotation.end) {
        var annotationStart = annotation.start - sequenceLength;
      } else {
        var annotationStart = annotation.start;
      }
      annotationRange.start % 3;
      if (annotationRange.start > annotationRange.end) {
        
      }
      annotationRange.start
      getAminoAcidDataForEachBaseOfDna()
      annotation.start
      annotationsSVG.push(<path
        onClick={function (event) {
          setSelectionLayer(this);
          event.stopPropagation();
        }.bind(annotation)} // 
        key={annotation.id + 'start:' + annotationRange.start}
        className={classnames(annotation.id, annotation.type)}
        d={createAnnotationRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight)}
        stroke={annotation.color}
        fillOpacity={0.4} //come back and change this to a passed var
        fill={annotation.color}/>);

      annotationsSVG.push(<path
        key={'directionArrow' + annotation.id + 'start:' + annotationRange.start}
        d={createAnnotationArrowRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight)}
        stroke={'black'} />);
    });
    var height = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
    return (
      <svg className="annotationContainer" width="100%" height={height} >
        {annotationsSVG}
      </svg>
    );
    function createAnnotationArrowRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight) {
      var annotation = annotationRange.annotation;
      var xCenter = getXCenterOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
      var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
      var rangeType = annotationRange.rangeType;
      var forward = annotation.forward;
      var xStart = xCenter - charWidth/2;
      var xEnd = xCenter + charWidth/2;
      var yEnd = yStart + annotationHeight;
      var yMiddle = yStart + annotationHeight/2;
      var path;
      if (forward) {
        path = "M" + xStart + "," + yStart + " L" + xEnd + "," + yMiddle + " L" + xStart + "," + yEnd;
      } else {

      }
      //either "beginning", "end" or "beginningAndEnd"
      if (rangeType === 'beginningAndEnd') {

      } else {

      }
      return path;
    }

    function createAnnotationRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight) {
      var annotation = annotationRange.annotation;
      var result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
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