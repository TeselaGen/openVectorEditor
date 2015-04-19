var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
var CHAR_HEIGHT = require('./editorConstants').CHAR_HEIGHT;
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
    // if (showReverseSequence) {
    //   combinedHeightOfChildElements+= (SPACE_BETWEEN_ANNOTATIONS + ANNOTATION_HEIGHT); //tnrtodo work out these spacing issues
    // }
    if (showFeatures) {
      // combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * ANNOTATION_HEIGHT + SPACE_BETWEEN_ANNOTATIONS;
      var featuresSVG = createAnnotationPaths({
        annotations: row.features,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: ANNOTATION_HEIGHT,
        spaceBetweenAnnotations: SPACE_BETWEEN_ANNOTATIONS,
        charWidth: CHAR_WIDTH,
        annotationYOffsetMax: row.featuresYOffsetMax,
      });

      function createAnnotationPaths({annotations, annotationYOffsetMax, createAnnotationRawPath, annotationHeight, spaceBetweenAnnotations, charWidth}) {
        var maxElementHeight = (annotationYOffsetMax + 1) * (annotationHeight + spaceBetweenAnnotations);
        var annotationsSVG = _.map(annotations, function(annotationRow) {
          var overlapPaths = annotationRow.overlaps.map(function(overlap) {
            // console.log(annotationRow);
            var annotation = annotationRow.annotation; 

            var drawingParameters = {
              xStart: (overlap.start % rowLength) * charWidth,
              width: ((overlap.end - overlap.start) % rowLength) * charWidth,
              yStart: annotationRow.yOffset * (annotationHeight + spaceBetweenAnnotations),
              height: annotationHeight,
              type: overlap.type,
              topStrand: annotation.topStrand,
            };
            var path = createAnnotationRawPath(drawingParameters);

            var attributes = {
              classnames: classnames(annotation.id, annotation.type),
              strokeColor: annotation.color, 
              fill: annotation.color,
              path: path,
              fillOpacity: .4, //come back and change this to a passed var
            };
            var annotationPath = createAnnotationPath(attributes);
            return annotationPath;
          });
          return (overlapPaths);

          function createAnnotationPath ({strokeColor, fill, classnames, path, fillOpacity}) {
              return(<path className={classnames} d={path} stroke={strokeColor} fill={fillOpacity} fill={fill}/>);
          };
        });
        return (
          <svg className="annotationContainer" width="100%" height={maxElementHeight} > 
            {annotationsSVG}
          </svg>
          );
      }
    }
    var fontSize = CHAR_WIDTH + "px";
    var textStyle = {
      fontSize: fontSize,
      fontFamily: "'Courier New', Courier, monospace", 
      // transform: "scale(2,1)",
      // width: "100%"
    };
    // var enclosingTextDivStyle = {
    //   width: "100%"
    // };
    console.log( (CHAR_WIDTH * (row.sequence.length - 1))); //tnr: -1 because everything else we're drawing is 0-based whereas the length is 1 based
    var textHTML = 
    '<text fontFamily="Courier New, Courier, monospace" x="0" y="10" textLength="'+ (CHAR_WIDTH * (row.sequence.length - 1)) + '" lengthAdjust="spacing">' + row.sequence + '</text>'

    return (
      <div className="infinite-list-item">
        <div className="rowContainer">
            {featuresSVG}
            <svg className= "textContainer" width="100%" height={CHAR_WIDTH} dangerouslySetInnerHTML={{__html: textHTML}}>
            </svg>

        </div>
      </div>
    );
  }
});


// <div style={textStyle}>
//             {row.sequence}
//           </div>

// <div fontSize={fontSize} fontFamily="'Courier New', Courier, monospace">

// <svg className= "textContainer" width="100%" height={CHAR_HEIGHT}>
//             <text fontSize={fontSize} fontFamily="'Courier New', Courier, monospace" style={{"textLength": 100}} lengthAdjust="spacingAndGlyphs">
//               {row.sequence}
//             </text> 
//           </svg>

module.exports = RowItem;