var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
var ANNOTATION_HEIGHT = require('./editorConstants').ANNOTATION_HEIGHT;
var SPACE_BETWEEN_ANNOTATIONS = require('./editorConstants').SPACE_BETWEEN_ANNOTATIONS;

var RowItem = React.createClass({
  getDefaultProps: function() {
    return {
      row: {
        features: {
        }
      }, //start the loading of the sequence with this basepair
      showFeatures: true,
      showReverseSequence: true,
      rowLength: 30,
    };
  },
  render: function () {
    var {rowLength, showFeatures, row, showReverseSequence} = this.props;
    var combinedHeightOfChildElements = 0;
    function createFeatureRawPath ({xStart, yStart, height, width, direction, type}) {
      var xEnd = xStart + width;
      var yEnd = yStart  + height;
      var path = "M"+xStart+","+ yStart
                      +" L"+xEnd+","+ yStart
                      +" L"+xEnd+","+ yEnd
                      +" L"+xStart+","+yEnd+" Z";
      return path;
    }

    // function makeAnnotation(xStart, yStart, height, length, direction, strokeColor, fill, id, pathMaker) {
    //   var path = pathMaker(xStart, yStart, height, length, direction, strokeColor);
    // }
    if (showReverseSequence) {
      combinedHeightOfChildElements+= (SPACE_BETWEEN_ANNOTATIONS + ANNOTATION_HEIGHT); //tnrtodo work out these spacing issues
    }
    if (showFeatures) {
      combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * (SPACE_BETWEEN_ANNOTATIONS + ANNOTATION_HEIGHT);
      var featuresSVG = createAnnotationPaths({
        annotations: row.features,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: ANNOTATION_HEIGHT,
        // annotationWidth: ((overlap.end - overlap.start) % rowLength) * charWidth,
        spaceBetweenAnnotations: SPACE_BETWEEN_ANNOTATIONS,
        charWidth: CHAR_WIDTH
      });

      function createAnnotationPaths({annotations, createAnnotationRawPath, annotationHeight, spaceBetweenAnnotations, charWidth}) {
        var annotationsSVG = _.map(annotations, function(annotationRow) {
          var overlapPaths = annotationRow.overlaps.map(function(overlap) {
            // console.log(annotationRow);
            var annotation = annotationRow.annotation; 
            var annotationWidth = ((overlap.end - overlap.start) % rowLength) * charWidth;
            var xStart = (overlap.start % rowLength) * charWidth;
            var yStart = annotationRow.yOffset * (annotationHeight + spaceBetweenAnnotations);
            height: 
            var drawingParameters = {
              // xStart: (overlap.start % rowLength) * charWidth,
              xStart: 0,
              width: annotationWidth,
              yStart: 0,
              height: annotationHeight,
              type: overlap.type,
              topStrand: annotation.topStrand,
            };
            // var drawingParameters = {
            //   // xStart: (overlap.start % rowLength) * charWidth,
            //   xStart: (overlap.start % rowLength) * charWidth,
            //   width: annotationWidth,
            //   yStart: annotationRow.yOffset * (annotationHeight + spaceBetweenAnnotations),
            //   height: annotationHeight,
            //   type: overlap.type,
            //   topStrand: annotation.topStrand,
            // };
            var path = createAnnotationRawPath(drawingParameters);

            var pathAttributes = {
              classnames: classnames(annotation.id, annotation.type),
              strokeColor: annotation.color, 
              fill: annotation.color,
              path: path,
              fillOpacity: .4, //come back and change this to a passed var
            };
            var svgStyles = {
              marginLeft: yStart,
            }
            var annotationPath = createAnnotationPath(pathAttributes);
            return (
              <div className="annotationContainer" height={annotationHeight} width={annotationWidth} x={xStart} y={yStart}>
                <svg y={yStart} width={annotationWidth} height={annotationHeight}> 
                  {annotationPath} 
                </svg>
                </div>
              );
          });
          return (overlapPaths);

          function createAnnotationPath ({strokeColor, fill, classnames, path, fillOpacity}) {
              return(<path className={classnames} d={path} stroke={strokeColor} fill={fillOpacity} fill={fill}/>);
          };
        });
        return annotationsSVG;
      }
    }
    // <div width="100%" className="textContainer">
    //         <svg width="100%" height={ANNOTATION_HEIGHT}>
    //           <text fontSize={fontSize} fontFamily="'Courier New', Courier, monospace" style={{"textLength": 100}} lengthAdjust="spacingAndGlyphs">
    //             {row.sequence}
    //           </text> 
    //         </svg>
    //     </div>
    var fontSize = CHAR_WIDTH + "px";
    return (
      <div className="infinite-list-item">
        <div width="100%" className="annotationContainer featureContainer">
            {featuresSVG}
        </div>
        <div fontSize={fontSize} fontFamily="'Courier New', Courier, monospace" width="100%" className="textContainer">
                {row.sequence}
        </div>
      </div>
    );
  }
});

module.exports = RowItem;