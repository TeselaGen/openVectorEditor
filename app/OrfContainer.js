var React = require('react');
var classnames = require('classnames');
var setSelectionLayer = require('./actions/setSelectionLayer');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');

var OrfContainer = React.createClass({
  render: function () {
    var annotationRanges = this.props.annotationRanges;
    var bpsPerRow = this.props.bpsPerRow;
    var charWidth = this.props.charWidth;
    var annotationHeight = this.props.annotationHeight;
    var spaceBetweenAnnotations = this.props.spaceBetweenAnnotations;

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

      // annotationsSVG.push(<path
      //   key={'directionArrow' + annotation.id + 'start:' + annotationRange.start}
      //   d={createAnnotationArrowRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight)}
      //   stroke={'black'} />);
    });
    var height = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
    return (
      <svg className="annotationContainer" width="100%" height={height} >
        {annotationsSVG}
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

    function createAnnotationRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight) {
      var annotation = annotationRange.annotation;
      var result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
      var xStart = result.xStart;
      var width = result.width;

      var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
      var height = annotationHeight / 2;
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
module.exports = OrfContainer;