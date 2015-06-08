var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
// var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
// var CHAR_HEIGHT = require('./editorConstants').CHAR_HEIGHT;
var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
// var ANNOTATION_HEIGHT = require('./editorConstants').ANNOTATION_HEIGHT;
// var SPACE_BETWEEN_ANNOTATIONS = require('./editorConstants').SPACE_BETWEEN_ANNOTATIONS;
var mixin = require('baobab-react/mixins').branch;
var appActions = require('./actions/appActions');

var SequenceContainer = React.createClass({
  render: function () {
    var {sequence, CHAR_WIDTH} = this.props;
    var textHTML = 
    '<text font-family="Courier New, Courier, monospace" x="'+ (CHAR_WIDTH/4) + '" y="10" textLength="'+ (CHAR_WIDTH * (sequence.length)) + '" length-adjust="spacing">' + sequence + '</text>'
    return <svg ref="textContainer" className="textContainer" width="100%" height={CHAR_WIDTH} dangerouslySetInnerHTML={{__html: textHTML}} />
  }
});

var RowItem = React.createClass({
  mixins: [mixin],
  cursors: {
    CHAR_WIDTH: ['vectorEditorState', 'CHAR_WIDTH'],
    CHAR_HEIGHT: ['vectorEditorState', 'CHAR_HEIGHT'], //potentially unneeded
    ANNOTATION_HEIGHT: ['vectorEditorState', 'ANNOTATION_HEIGHT'],
    SPACE_BETWEEN_ANNOTATIONS: ['vectorEditorState', 'SPACE_BETWEEN_ANNOTATIONS'],
    showFeatures: ['vectorEditorState', 'showFeatures'],
    showParts: ['vectorEditorState', 'showParts'],
    showReverseSequence: ['vectorEditorState', 'showReverseSequence'],
    // sequenceData: ['vectorEditorState', 'sequenceData'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
    mouse: ['vectorEditorState', 'mouse'],
    caretPosition: ['vectorEditorState', 'caretPosition'],
  },
  facets: {
    sequenceLength: 'sequenceLength',
    bpsPerRow: 'bpsPerRow',
  },

  render: function () {
    var {row} = this.props;
    var bpsPerRow = this.state.bpsPerRow;
    var showFeatures = this.state.showFeatures;
    var showParts = this.state.showParts;
    // var showReverseSequence = this.state.showReverseSequence;
    var selectionLayer = this.state.selectionLayer;
    var caretPosition = this.state.caretPosition;
    var combinedHeightOfChildElements = 0;
    var self = this;
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
    //   combinedHeightOfChildElements+= (this.state.SPACE_BETWEEN_ANNOTATIONS + this.state.ANNOTATION_HEIGHT); //tnrtodo work out these spacing issues
    // }
    if (showFeatures) {
      // combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * this.state.ANNOTATION_HEIGHT + this.state.SPACE_BETWEEN_ANNOTATIONS;
      var featuresSVG = createAnnotationPaths({
        annotationRanges: row.features,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: this.state.ANNOTATION_HEIGHT,
        spaceBetweenAnnotations: this.state.SPACE_BETWEEN_ANNOTATIONS,
        charWidth: this.state.CHAR_WIDTH,
        // annotationYOffsetMax: row.featuresYOffsetMax,
      });
    }

    if (showParts) {
      // combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * this.state.ANNOTATION_HEIGHT + this.state.SPACE_BETWEEN_ANNOTATIONS;
      var partsSVG = createAnnotationPaths({
        annotationRanges: row.parts,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: this.state.ANNOTATION_HEIGHT,
        spaceBetweenAnnotations: this.state.SPACE_BETWEEN_ANNOTATIONS,
        charWidth: this.state.CHAR_WIDTH,
        // annotationYOffsetMax: row.featuresYOffsetMax,
      });
    }

    function getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth) {
      // 24 bps long: 
      // 
      // if (range.end + 1 - range.start > 0 && )
      // (range.end + 1 - range.start) % bpsPerRow
      return {
        xStart: (range.start % bpsPerRow) * charWidth,
        width: ((range.end + 1 - range.start)) * charWidth,
      };
    }

    function createAnnotationPaths({annotationRanges, createAnnotationRawPath, annotationHeight, spaceBetweenAnnotations, charWidth}) {
      if (annotationRanges.length === 0) {
        return [];
      }
      var maxAnnotationYOffset = 0;
      var annotationsSVG = _.map(annotationRanges, function(annotationRange) {
        if (annotationRange.yOffset > maxAnnotationYOffset) {
          maxAnnotationYOffset = annotationRange.yOffset;
        }
        // var overlapPaths = annotationRange.overlaps.map(function(overlap) {
          // console.log(annotationRange);
          var annotation = annotationRange.annotation; 

          //get the type of range we're going to be displaying
          // if (annotationRange.start === annotation.start) {
          //   var annotationRange.rangeType
          // }

          var drawingParameters = {
            xStart: (annotationRange.start % bpsPerRow) * charWidth,
            width: ((annotationRange.end + 1 - annotationRange.start)) * charWidth,
            yStart: annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations),
            height: annotationHeight,
            type: annotationRange.type,
            topStrand: annotation.topStrand,
          };
          var path = createAnnotationRawPath(drawingParameters);

          var attributes = {
            classnames: classnames(annotation.id, annotation.type),
            strokeColor: annotation.color, 
            fill: annotation.color,
            path: path,
            fillOpacity: 0.4, //come back and change this to a passed var
          };
          var annotationPath = createAnnotationPath(attributes);
          return annotationPath;
        // });
        // return (overlapPaths);

        function createAnnotationPath ({strokeColor, fill, classnames, path, fillOpacity}) {
            return(<path className={classnames} d={path} stroke={strokeColor} fillOpacity={fillOpacity} fill={fill}/>);
        }
      });
      var height = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
      return (
        <svg className="annotationContainer" width="100%" height={height} > 
          {annotationsSVG}
        </svg>
        );
    }

    var fontSize = this.state.CHAR_WIDTH + "px";
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

    var cursorStyle = {
      height: "90%",
      // width: "100%",
      background: 'black',
      position: "absolute",
      top: "0",
      width: "2px",
      cursor: "ew-resize",
      // left: "0",
      // fillOpacity: "1",
      // opacity: ".3",
    };
    
    var selectionCursorStart;
    var selectionCursorEnd;
    var highlightLayerForRow = getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, this.state.CHAR_WIDTH, cursorStyle);
    function getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, charWidth, cursorStyle) {
      var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row);
      var selectionLayers = overlaps.map(function (overlap) {
        if (overlap.start === selectionLayer.start) {
          selectionCursorStart = getCursorForRow(overlap.start, row, bpsPerRow, cursorStyle, charWidth);
        }
        if (overlap.end === selectionLayer.end) {
          selectionCursorEnd = getCursorForRow(overlap.end + 1, row, bpsPerRow, cursorStyle, charWidth);
        }
        var {xStart, width} = getXStartAndWidthOfRowAnnotation(overlap, bpsPerRow, charWidth);
        highlightLayerStyle.width = width;
        highlightLayerStyle.left = xStart;
        return (<div className="selectionLayer" style={highlightLayerStyle}/>);
      });
      return selectionLayers;
    }

    

    var cursor = getCursorForRow(caretPosition, row, bpsPerRow, cursorStyle, this.state.CHAR_WIDTH);
    function getCursorForRow (caretPosition, row, bpsPerRow, cursorStyle, charWidth) {
      if(row.start<= caretPosition && row.end + 1 >= caretPosition || (row.end === self.state.sequenceLength - 1 && row.end < caretPosition) ) {
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = _.assign({}, cursorStyle, {left: (caretPosition - row.start) * charWidth});
        return (<div className="cursor" style={newCursorStyle}  />);
        // onHover={self.onCursorHover}
      }
    }


    // var enclosingTextDivStyle = {
    //   width: "100%"
    // };
    // console.log( (this.state.CHAR_WIDTH * (row.sequence.length - 1))); //tnr: -1 because everything else we're drawing is 0-based whereas the length is 1 based
    //maybe use text-align middle with the x-position in the middle of the block.. something seems just a touch off with the character width stuff...
    //not sure what it is exactly...
    //should probably change the row.sequence.length -1 to no -1
    //text-anchor="middle"
    
    // var sequenceArray = row.sequence.split("");
    // charArray = [];
    // sequenceArray.forEach(function (char, index) {
    //   var left = this.state.CHAR_WIDTH * index - (this.state.CHAR_WIDTH/2)
    //   sequenceTextStyle = {
    //   display: "inline",
    //   position: "absolute",
    //   left: left,
    // }
    //   // charArray.left = this.state.CHAR_WIDTH * i + (this.state.CHAR_WIDTH/2);
    //   // {left: this.state.CHAR_WIDTH * i + (this.state.CHAR_WIDTH/2)}
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
    //   // var left = this.state.CHAR_WIDTH * i + (this.state.CHAR_WIDTH/2)
    //   charArray.left = this.state.CHAR_WIDTH * i + (this.state.CHAR_WIDTH/2);
    //   // {left: this.state.CHAR_WIDTH * i + (this.state.CHAR_WIDTH/2)}
    //   charArray.push(
    //     <div style={sequenceTextStyle}> 
    //       {row.sequence[i]}
    //     </div>
    //   )
    // };
    // return charArray;
    var rowContainerStyle = {
      overflow: "hidden",
      position: "relative",
      width: "100%",
    };

    var textHTML = 
    '<text font-family="Courier New, Courier, monospace" x="'+ (this.state.CHAR_WIDTH/4) + '" y="10" textLength="'+ (this.state.CHAR_WIDTH * (row.sequence.length)) + '" length-adjust="spacing">' + row.sequence + '</text>'
    var reverseSequenceHTML = 
    '<text font-family="Courier New, Courier, monospace" x="'+ (this.state.CHAR_WIDTH/4) + '" y="10" textLength="'+ (this.state.CHAR_WIDTH * (row.sequence.length)) + '" length-adjust="spacing">' + row.sequence + '</text>'
    // console.log(row);
    // var className = "row" + row.rowNumber;
      // <div className={className}>
      // <svg ref="textContainer" className="textContainer" width="100%" height={this.state.CHAR_WIDTH} dangerouslySetInnerHTML={{__html: textHTML}} />
      //       <svg ref="reverseSequenceContainer" className="reverseSequenceContainer" width="100%" height={this.state.CHAR_WIDTH} dangerouslySetInnerHTML={{__html: textHTML}} />
    return (
        <div className="rowContainer" 
          style={rowContainerStyle} 
          onClick={this.onClick} 
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          >
            {featuresSVG}
            {partsSVG}
            <SequenceContainer sequence={row.sequence} CHAR_WIDTH={this.state.CHAR_WIDTH}/>
            {this.state.showReverseSequence &&
              <SequenceContainer sequence={row.sequence.split('').reverse().join('')} CHAR_WIDTH={this.state.CHAR_WIDTH}/>
            }
            {row.rowNumber}
            //
            {row.start}
            {highlightLayerForRow}
            {selectionCursorStart}
            {selectionCursorEnd}
            {cursor}
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