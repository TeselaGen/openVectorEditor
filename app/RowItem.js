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
      rowLength: 30,
    };
  },
  render: function () {
    var {rowLength, showFeatures, row} = this.props;
    var combinedHeightOfChildElements = 0;
    function createFeatureRawPath ({xStart, yStart, height, width, direction, type}) {
      var xEnd = xStart + width;
      var yEnd = yStart  + height;
      var path = "M"+xStart+","+ yStart
                      +" L"+xEnd+","+ yStart
                      +" L"+xEnd+","+ yEnd
                      +" L"+xStart+","+yEnd+" Z";
      
    }

    // function makeAnnotation(xStart, yStart, height, length, direction, strokeColor, fill, id, pathMaker) {
    //   var path = pathMaker(xStart, yStart, height, length, direction, strokeColor);
    // }
    if (showFeatures) {
      combinedHeightOfChildElements+= row.featuresYOffsetMax * (SPACE_BETWEEN_ANNOTATIONS * ANNOTATION_HEIGHT)
      var featuresSVG = createAnnotationPaths(row.features, createFeatureRawPath, ANNOTATION_HEIGHT, SPACE_BETWEEN_ANNOTATIONS, CHAR_WIDTH);

      

      function createAnnotationPaths(annotations, createAnnotationRawPath, annotationHeight, spaceBetweenAnnotations, charWidth) {
        _.map(annotations, function(annotation) {
          var overlapPaths = annotation.overlaps.map(function(overlap) {
            console.log(annotation);
            
            var drawingParameters = {
              xStart: (overlap.start % rowLength) * charWidth,
              width: (overlap.end % rowLength) * charWidth,
              yStart: annotation.yOffset * (annotationHeight + spaceBetweenAnnotations),
              height: annotationHeight + annotation.yOffset * (annotationHeight + spaceBetweenAnnotations),
              type: overlap.type,
              topStrand: annotation.topStrand,
            };
            var path = createAnnotationRawPath(drawingParameters);

            var attributes = {
              classnames: classnames(annotation.id, annotation.type),
              strokeColor: annotation.color,
              fill: annotation.color,
              path: path,
            };
            return createAnnotationPath(attributes);



            // var xStart = (overlap.start % rowLength) * CHAR_WIDTH,
            // var xEnd = (overlap.end % rowLength)*CHAR_WIDTH;
            // var yStart = annotation.yOffset * (annotationHeight + spaceBetweenAnnotations);
            // var yEnd = annotationHeight + annotation.yOffset * (annotationHeight + spaceBetweenAnnotations);

            // var path = "M" + xStart + "," + yStart + " L" + xEnd + "," + yStart + " L" + xEnd + "," + yEnd + " L" + xStart + "," + yEnd + " Z";
            // return ( <path className={annotation.id} d={path} stroke={annotation.color} fill="none" /> );
            // fill="transparent" 
            //                stroke-width="10" 
            //                d="M0,0 L100,100">

            // return(<path d="M0,0 L100,100" stroke-width="10" stroke="#006666" fillOpacity=".9" fill="transparent">
            //         </path>)

            // return(<circle cx="50" cy="50" r="25" fill="mediumorchid" ></circle>
            //   );
            // var coordinates = { //remember svgs are drawn with 0,0 being the top left of the page
            //   topLeft: "M"+drawStart+","+"0",
            //   topRight: " L"+xEnd+","+"0",
            //   bottomRight: " L"+xEnd+","+annotationHeight,
            //   bottomLeft: " L"++drawStart+","+annotationHeight+" Z",
            // }
            // var path = coordinates.topLeft + coordinates.topRight + coordinates.bottomRight + coordinates.bottomLeft;

          });
          return (overlapPaths);

          function createAnnotationPath ({strokeColor, fill, classnames, path}) {
              return(<path className={classnames} d={path} stroke={strokeColor} fill={fill}/>);
          };
        });
      }
    }
    var fontSize = CHAR_WIDTH + "px";
    return (
      <div className="infinite-list-item">
        <div className="rowContainer">
          <svg width="100%" height={combinedHeightOfChildElements}>
            {featuresSVG}
            <text x="0" y="60" fontSize={fontSize} fontFamily="'Courier New', Courier, monospace" style={{"textLength": 100}} lengthAdjust="spacingAndGlyphs">
              {row.sequence}
            </text> 
          </svg>
        </div>
      </div>
    );
  }
});

module.exports = RowItem;