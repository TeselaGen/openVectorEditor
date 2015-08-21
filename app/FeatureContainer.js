var React = require('react');
var classnames = require('classnames');
var setSelectionLayer = require('./actions/setSelectionLayer');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var Feature = require('./Feature');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AnnotationContainerHolder = require('./AnnotationContainerHolder');
var AnnotationPositioner = require('./AnnotationPositioner');

var FeatureContainer = React.createClass({
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
      var result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
      annotationsSVG.push(
        <AnnotationPositioner 
          height={annotationHeight} 
          width={result.width}
          key={'feature' + annotation.id + 'start:' + annotationRange.start}
          top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
          left={result.xStart}
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
            name={annotation.name}
            fill={annotation.color}>
          </Feature>
        </AnnotationPositioner>
      );
    });
    var containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
    // height={containerHeight}
    return (
      <AnnotationContainerHolder 
        containerHeight={containerHeight}>
        {annotationsSVG}
      </AnnotationContainerHolder>
    );
   
  }
});
module.exports = FeatureContainer;