var React = require('react');
var classnames = require('classnames');
var setSelectionLayer = require('./actions/setSelectionLayer');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var Feature = require('./Feature');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AnnotationContainer = React.createClass({
  mixins: [PureRenderMixin],
  
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
      if (annotationRange.yOffset > maxAnnotationYOffset) {
        maxAnnotationYOffset = annotationRange.yOffset;
      }
      var annotation = annotationRange.annotation;
// <path
//             onClick={function (event) {
//               // appActions.setCaretPosition(-1);
//               setSelectionLayer(this);
//               event.stopPropagation();
//             }.bind(annotation)}
//             key={annotation.id + 'start:' + annotationRange.start}
//             className={classnames(annotation.id, annotation.type)}
//             d={createAnnotationRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight)}
//             stroke={annotation.color}
//             fillOpacity={0.4}
//             fill={annotation.color}>
//           </path>
      var result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
      annotationsSVG.push(
        <g 
          y={annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
          x={result.xStart}
          key={'feature' + annotation.id + 'start:' + annotationRange.start}
          >
          <Feature
            onClick={function (event) {
              setSelectionLayer(this);
              event.stopPropagation();
            }.bind(annotation)}
            className={classnames(annotation.id, annotation.type)}
            widthInBps={annotationRange.end - annotationRange.start + 1}
            charWidth={charWidth}
            forward={annotation.forward}
            height={annotationHeight}
            color={annotation.color}
            fill={annotation.color}>
          </Feature>
        </g>
      );
    });
    var containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
    
    return (
      <svg className="annotationContainer" width="100%" height={containerHeight} >
        {annotationsSVG}
      </svg>
    );
   

    function createAnnotationRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight) {
      var annotation = annotationRange.annotation;
      var result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
      var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
      var height = annotationHeight;
      var enclosingRangeType = annotationRange.enclosingRangeType;
      var forward = annotation.forward;
      var xEnd = result.xStart + result.width;
      var yEnd = yStart + height;

      if (forward) {

      } else {

      }
      //either "beginning", "end" or "beginningAndEnd"
      if (enclosingRangeType === 'beginningAndEnd') {

      } else {

      }
      var path = "M" + result.xStart + "," + yStart + " L" + xEnd + "," + yStart + " L" + xEnd + "," + yEnd + " L" + result.xStart + "," + yEnd + " Z";
      return path;
    }

  }
});
module.exports = AnnotationContainer;