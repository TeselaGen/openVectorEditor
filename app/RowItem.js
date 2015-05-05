var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
var CHAR_HEIGHT = require('./editorConstants').CHAR_HEIGHT;
var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var ANNOTATION_HEIGHT = require('./editorConstants').ANNOTATION_HEIGHT;
var SPACE_BETWEEN_ANNOTATIONS = require('./editorConstants').SPACE_BETWEEN_ANNOTATIONS;
var mixin = require('baobab-react/mixins').branch;
var appActions = require('./actions/appActions');



var RowItem = React.createClass({
  mixins: [mixin],
  cursors: {
    visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
    // sequenceData: ['vectorEditorState', 'sequenceData'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
    cursorPosition: ['vectorEditorState', 'cursorPosition'],
  },

  getDefaultProps: function() {
    return {
      row: {
        features: {
        }
      },
      showFeatures: true,
      showReverseSequence: true,
      rowLength: 30,
    };
  },
  getNearestBPToCursorEvent: function (event) {
    var clickXPositionRelativeToRowContainer =event.clientX - event.currentTarget.clientLeft
    var nearestBP = Math.floor(clickXPositionRelativeToRowContainer/CHAR_WIDTH);
    if (nearestBP < 0) {
      console.warn("something went wrong, this shouldn't give a negative number ever")
    }
    nearestBP+= this.props.row.start;
    if (nearestBP > this.props.row.end) {
      nearestBP = this.props.row.end;
    }
    return nearestBP;
  },
  onClick: function (event) {
    var nearestBp = this.getNearestBPToCursorEvent(event);
    // if (event.)
    appActions.setCursorPosition(nearestBp);
    appActions.cancelSelection();
    // this.props.row.start
    // console.log(a,b);
    // var c = this.refs.textContainer.getDomNode();
  },

  onDragOver: function (event) {
    console.log('dragover');
    var clickXPositionRelativeToRowContainer =event.clientX - event.currentTarget.clientLeft
    var nearestBP = Math.floor(clickXPositionRelativeToRowContainer/CHAR_WIDTH);
    if (nearestBP < 0) {
      console.warn("something went wrong, this shouldn't give a negative number ever")
    }
    nearestBP+= this.props.row.start;
    if (nearestBP > this.props.row.end) {
      nearestBP = this.props.row.end;
    }
    appActions.setCursorPosition(nearestBP);
    // this.props.row.start
    // console.log(a,b);
    // var c = this.refs.textContainer.getDomNode();
  },

  render: function () {
    var {rowLength, row} = this.props;
    var visibilityParameters = this.state.visibilityParameters;
    var selectionLayer = this.state.selectionLayer;
    var cursorPosition = this.state.cursorPosition;
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
    if (visibilityParameters.showFeatures) {
      // combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * ANNOTATION_HEIGHT + SPACE_BETWEEN_ANNOTATIONS;
      var featuresSVG = createAnnotationPaths({
        annotations: row.features,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: ANNOTATION_HEIGHT,
        spaceBetweenAnnotations: SPACE_BETWEEN_ANNOTATIONS,
        charWidth: CHAR_WIDTH,
        annotationYOffsetMax: row.featuresYOffsetMax,
      });
    }

    if (visibilityParameters.showParts) {
      // combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * ANNOTATION_HEIGHT + SPACE_BETWEEN_ANNOTATIONS;
      var partsSVG = createAnnotationPaths({
        annotations: row.parts,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: ANNOTATION_HEIGHT,
        spaceBetweenAnnotations: SPACE_BETWEEN_ANNOTATIONS,
        charWidth: CHAR_WIDTH,
        annotationYOffsetMax: row.featuresYOffsetMax,
      });
    }

    function getXStartAndWidthOfRowAnnotation(range, rowLength, charWidth) {
      // 24 bps long: 
      // 
      // if (range.end + 1 - range.start > 0 && )
      // (range.end + 1 - range.start) % rowLength
      return {
        xStart: (range.start % rowLength) * charWidth,
        width: ((range.end + 1 - range.start)) * charWidth,
      };
    }

    function createAnnotationPaths({annotations, annotationYOffsetMax, createAnnotationRawPath, annotationHeight, spaceBetweenAnnotations, charWidth}) {
      var maxElementHeight = (annotationYOffsetMax + 1) * (annotationHeight + spaceBetweenAnnotations);
      var annotationsSVG = _.map(annotations, function(annotationRow) {
        var overlapPaths = annotationRow.overlaps.map(function(overlap) {
          // console.log(annotationRow);
          var annotation = annotationRow.annotation; 

          var drawingParameters = {
            xStart: (overlap.start % rowLength) * charWidth,
            width: ((overlap.end + 1 - overlap.start)) * charWidth,
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

    var fontSize = CHAR_WIDTH + "px";
    var textStyle = {
      fontSize: fontSize,
      fontFamily: "'Courier New', Courier, monospace", 
      // transform: "scale(2,1)",
      // width: "100%"
    };
    var highlightLayerStyle = {
      height: "90%",
      // width: "100%",
      background: 'blue',
      position: "absolute",
      top: "0",
      // left: "0",
      // fillOpacity: ".3",
      opacity: ".3",
    };
    var rowContainerStyle = {
      overflow: "hidden",
      position: "relative",
      width: "100%",
    };

    var cursorStyle = {
      height: "90%",
      // width: "100%",
      background: 'black',
      position: "absolute",
      top: "0",
      width: 2,
      // left: "0",
      // fillOpacity: "1",
      // opacity: ".3",
    };

    var highlightLayerForRow = getHighlightLayerForRow(selectionLayer, row, rowLength, highlightLayerStyle, CHAR_WIDTH);
    function getHighlightLayerForRow(selectionLayer, row, rowLength, highlightLayerStyle, charWidth) {
      var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row);
      var selectionLayers = overlaps.map(function (overlap) {
        var {xStart, width} = getXStartAndWidthOfRowAnnotation(overlap, rowLength, charWidth);
        highlightLayerStyle.width = width;
        highlightLayerStyle.left = xStart;
        return (<div className="selectionLayer" style={highlightLayerStyle}/>);
      });
      return selectionLayers;
    }

    var cursor = getCursorForRow(cursorPosition, row, rowLength, cursorStyle, CHAR_WIDTH)
    function getCursorForRow (cursorPosition, row, rowLength, cursorStyle, charWidth) {
      if(row.start<= cursorPosition && row.end >= cursorPosition) {
        cursorStyle.left = (cursorPosition % rowLength) * charWidth;
        return (<div className="cursor" style={cursorStyle}/>);
      }
    }


    // var enclosingTextDivStyle = {
    //   width: "100%"
    // };
    // console.log( (CHAR_WIDTH * (row.sequence.length - 1))); //tnr: -1 because everything else we're drawing is 0-based whereas the length is 1 based
    //maybe use text-align middle with the x-position in the middle of the block.. something seems just a touch off with the character width stuff...
    //not sure what it is exactly...
    //should probably change the row.sequence.length -1 to no -1
    //text-anchor="middle"
    
    // var sequenceArray = row.sequence.split("");
    // charArray = [];
    // sequenceArray.forEach(function (char, index) {
    //   var left = CHAR_WIDTH * index - (CHAR_WIDTH/2)
    //   sequenceTextStyle = {
    //   display: "inline",
    //   position: "absolute",
    //   left: left,
    // }
    //   // charArray.left = CHAR_WIDTH * i + (CHAR_WIDTH/2);
    //   // {left: CHAR_WIDTH * i + (CHAR_WIDTH/2)}
    //   charArray.push(
    //     <div style={sequenceTextStyle}> 
    //       {char}
    //     </div>
    //   )
    // })
    

    // if (charArray.length > 0) {
    //   var sequenceText = (
    //     <div>
    //       {charArray}
    //     </div>
    //     )
    // }

            // {sequenceText}


    // for (var i = 0; i < row.sequence.length; i++) {
    //   // var left = CHAR_WIDTH * i + (CHAR_WIDTH/2)
    //   charArray.left = CHAR_WIDTH * i + (CHAR_WIDTH/2);
    //   // {left: CHAR_WIDTH * i + (CHAR_WIDTH/2)}
    //   charArray.push(
    //     <div style={sequenceTextStyle}> 
    //       {row.sequence[i]}
    //     </div>
    //   )
    // };
    // return charArray;

    row.sequence
    var textHTML = 
    '<text fontFamily="Courier New, Courier, monospace" x="'+ (CHAR_WIDTH/2) + '" y="10" textLength="'+ (CHAR_WIDTH * (row.sequence.length)) + '" lengthAdjust="spacing">' + row.sequence + '</text>'
    // console.log(row);
    var className = "row" + row.rowNumber;
    return (
      <div className={className}>
        <div className="rowContainer" style={rowContainerStyle} onClick={this.onClick} onDragOver={this.onDragOver}>
            {featuresSVG}
            {partsSVG}
            <svg ref="textContainer" className="textContainer" width="100%" height={CHAR_WIDTH} dangerouslySetInnerHTML={{__html: textHTML}} />
            {row.rowNumber}

            {row.start}
            {highlightLayerForRow}
            {cursor}
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