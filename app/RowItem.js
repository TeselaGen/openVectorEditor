var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
// var charWidth = require('./editorConstants').charWidth;
// var CHAR_HEIGHT = require('./editorConstants').CHAR_HEIGHT;
var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
// var ANNOTATION_HEIGHT = require('./editorConstants').ANNOTATION_HEIGHT;
// var SPACE_BETWEEN_ANNOTATIONS = require('./editorConstants').SPACE_BETWEEN_ANNOTATIONS;
var baobabBranch = require('baobab-react/mixins').branch;
var appActions = require('./actions/appActions');
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
var getXCenterOfRowAnnotation = require('./getXCenterOfRowAnnotation');

var SequenceContainer = React.createClass({
  render: function () {
    var {sequence, charWidth} = this.props;
    var textHTML = '<text font-family="Courier New, Courier, monospace" x="'+ (charWidth/4) + '" y="10" textLength="'+ (charWidth * (sequence.length)) + '" length-adjust="spacing">' + sequence + '</text>';
    return <svg ref="textContainer" className="textContainer" width="100%" height={charWidth} dangerouslySetInnerHTML={{__html: textHTML}} />;
  }
});

var AxisContainer = React.createClass({
  // createAxisPath:  function (annotationRange, bpsPerRow, charWidth, annotationHeight) {
  //   var annotation = annotationRange.annotation;
  //   var {xStart, width} = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
  //   var yStart = annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations);
  //   var height = annotationHeight;
  //   var rangeType = annotationRange.rangeType;
  //   var forward = annotation.forward;
  //   var xEnd = xStart + width;
  //   var yEnd = yStart + height;

  //   if (forward) {

  //   } else {

  //   }
  //   //either "beginning", "end" or "beginningAndEnd"
  //   if (rangeType === 'beginningAndEnd') {

  //   } else {

  //   }
  //   var path = "M" + xStart + "," + yStart + " L" + xEnd + "," + yStart + " L" + xEnd + "," + yEnd + " L" + xStart + "," + yEnd + " Z";
  //   return path;
  // },

  render: function () {
    var {row, bpsPerRow, charWidth, annotationHeight, tickSpacing} = this.props;
    var {xStart, width} = getXStartAndWidthOfRowAnnotation(row, bpsPerRow, charWidth);
    //this function should take in a desired tickSpacing (eg 10 bps between tick mark)
    //and output an array of tickMarkPositions for the given row (eg, [0, 10, 20])
    function calculateTickMarkPositionsForGivenRow (tickSpacing, row) {
      var rowLength = row.end - row.start;
      var firstTickOffsetFromRowStart = tickSpacing - (row.start % tickSpacing);
      var arrayOfTickMarkPositions = [];
      for (var tickMarkPositions = firstTickOffsetFromRowStart; tickMarkPositions < rowLength; tickMarkPositions+=tickSpacing) {
        arrayOfTickMarkPositions.push(tickMarkPositions);
      }
      return arrayOfTickMarkPositions;
    }
    xEnd = xStart + width;
    yStart = 0;
    var tickMarkPositions = calculateTickMarkPositionsForGivenRow(tickSpacing,row);
    tickMarkSVG = [];
    tickMarkPositions.forEach(function (tickMarkPosition) {
       var xCenter = getXCenterOfRowAnnotation({start: tickMarkPosition, end: tickMarkPosition}, bpsPerRow, charWidth);
       var yStart = 0;
       var yEnd = annotationHeight/3;
       tickMarkSVG.push(<path
        key={'axisTickMark ' + row.rowNumber + ' ' + tickMarkPosition}
        d={"M" + xCenter + "," + yStart + " L" + xCenter + "," + yEnd}
        stroke={'black'} />);
       tickMarkSVG.push(
        <text
          key={'axisTickMarkText ' + row.rowNumber + ' ' + tickMarkPosition}
          stroke={'black'}
          x={xCenter}
          y={annotationHeight}
          style={{"textAnchor": "middle", "fontSize": 10, "fontFamily": "Verdana"}}
          >
          {row.start + tickMarkPosition}
        </text>);
    });

    return (
      <svg className="tickMarkContainer" width="100%" height={annotationHeight*1.2} >
        {tickMarkSVG}
        <path
        key={'axis ' + row.rowNumber}
        d={"M" + xStart + "," + yStart + " L" + xEnd + "," + yStart}
        stroke={'black'} />
      </svg>
    );
  }
});

// var FeatureContainer = React.createClass({
//   render: function () {
//     return (
//       <AnnotationContainer  {...this.props}/>
//     );
//   }
// });
var OrfContainer = React.createClass({
  render: function () {
    var {row, annotationRanges, bpsPerRow, charWidth, annotationHeight, spaceBetweenAnnotations} = this.props;
    
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
      //based on the orf start, its frame, and whether or not it's forward
      //we should be able to compute the amino acid frame for the row
      //
      if (annotation.forward) {
        var annotationRangeFrame;
        if (annotationRange.start > annotation.start) {
          annotationRangeFrame = (annotationRange.start - annotation.start)%3;
        } else {
          annotationRangeFrame = (annotation.start - annotationRange.start)%3;
        }
        function yargh (sequence) {
          //we now need to get a mapping of the sequence to the amino acids they form
          for (var i = annotationRangeFrame + annotationRange.start; i < array.length; i++) {
            array[i]
          }
        }
        row.sequence
      } else {
        
      }
      
      
      if (annotation.start > annotation.end) {
        var annotationStart = annotation.start - sequenceLength;
      } else {
        var annotationStart = annotation.start
      }
      annotationRange.start % 3
      if (annotationRange.start > annotationRange.end) {
        
      }
      annotationRange.start
      getAminoAcidsFromSequenceString()
      annotation.start
      annotationsSVG.push(<path
        onClick={function (event) {
          // appActions.setCaretPosition(-1);
          appActions.setSelectionLayer(this);
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
      var {xStart, width} = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
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

var AnnotationContainer = React.createClass({
  render: function () {
    var {annotationRanges, bpsPerRow, charWidth, annotationHeight, spaceBetweenAnnotations} = this.props;
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

      annotationsSVG.push(<path
        onClick={function (event) {
          // appActions.setCaretPosition(-1);
          appActions.setSelectionLayer(this);
          event.stopPropagation();
        }.bind(annotation)}
        key={annotation.id + 'start:' + annotationRange.start}
        className={classnames(annotation.id, annotation.type)}
        d={createAnnotationRawPath(annotationRange, bpsPerRow, charWidth, annotationHeight)}
        stroke={annotation.color}
        fillOpacity={0.4}
        fill={annotation.color}/>); //tnrtodo: change fill opacity to a passed variable

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
      var {xStart, width} = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
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

var RowItem = React.createClass({
  mixins: [baobabBranch],
  cursors: {
    charWidth: ['vectorEditorState', 'charWidth'],
    CHAR_HEIGHT: ['vectorEditorState', 'CHAR_HEIGHT'], //potentially unneeded
    ANNOTATION_HEIGHT: ['vectorEditorState', 'ANNOTATION_HEIGHT'],
    tickSpacing: ['vectorEditorState', 'tickSpacing'],
    SPACE_BETWEEN_ANNOTATIONS: ['vectorEditorState', 'SPACE_BETWEEN_ANNOTATIONS'],
    showFeatures: ['vectorEditorState', 'showFeatures'],
    showParts: ['vectorEditorState', 'showParts'],
    showOrfs: ['vectorEditorState', 'showOrfs'],
    showAxis: ['vectorEditorState', 'showAxis'],
    showReverseSequence: ['vectorEditorState', 'showReverseSequence'],
    // sequenceData: ['vectorEditorState', 'sequenceData'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
    mouse: ['vectorEditorState', 'mouse'],
    caretPosition: ['vectorEditorState', 'caretPosition'],
    sequenceLength: ['$sequenceLength'],
    bpsPerRow: ['$bpsPerRow']
  },

  render: function () {
    var {row} = this.props;
    var bpsPerRow = this.state.bpsPerRow;
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

    // function getXStartAndWidthOfRowAnnotation(range, bpsPerRow, charWidth) {
    //   // 24 bps long:
    //   //
    //   // if (range.end + 1 - range.start > 0 && )
    //   // (range.end + 1 - range.start) % bpsPerRow
    //   return {
    //     xStart: (range.start % bpsPerRow) * charWidth,
    //     width: ((range.end + 1 - range.start)) * charWidth,
    //   };
    // }

    var fontSize = this.state.charWidth + "px";
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
    var highlightLayerForRow = getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, this.state.charWidth, cursorStyle, this.state.sequenceLength);
    function getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, charWidth, cursorStyle, sequenceLength) {
      var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row, sequenceLength);
      var selectionLayers = overlaps.map(function (overlap, index) {
        if (overlap.start === selectionLayer.start) {
          selectionCursorStart = getCursorForRow(overlap.start, row, bpsPerRow, cursorStyle, charWidth);
        }
        if (overlap.end === selectionLayer.end) {
          selectionCursorEnd = getCursorForRow(overlap.end + 1, row, bpsPerRow, cursorStyle, charWidth);
        }
        var {xStart, width} = getXStartAndWidthOfRowAnnotation(overlap, bpsPerRow, charWidth);
        var style = _.assign({}, highlightLayerStyle, {width: width, left: xStart});
        return (<div key={index} className="selectionLayer" style={style}/>);
      });
      return selectionLayers;
    }

    var cursor = getCursorForRow(caretPosition, row, bpsPerRow, cursorStyle, this.state.charWidth);
    function getCursorForRow (caretPosition, row, bpsPerRow, cursorStyle, charWidth) {
      if(row.start<= caretPosition && row.end + 1 >= caretPosition || (row.end === self.state.sequenceLength - 1 && row.end < caretPosition) ) {
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = _.assign({}, cursorStyle, {left: (caretPosition - row.start) * charWidth});
        return (<div className="cursor" style={newCursorStyle}  />);
        // onHover={self.onCursorHover}
      }
    }
    var rowContainerStyle = {
      overflow: "hidden",
      position: "relative",
      width: "100%",
    };

    var textHTML = '<text font-family="Courier New, Courier, monospace" x="'+ (this.state.charWidth/4) + '" y="10" textLength="'+ (this.state.charWidth * (row.sequence.length)) + '" length-adjust="spacing">' + row.sequence + '</text>';
    var reverseSequenceHTML = '<text font-family="Courier New, Courier, monospace" x="'+ (this.state.charWidth/4) + '" y="10" textLength="'+ (this.state.charWidth * (row.sequence.length)) + '" length-adjust="spacing">' + row.sequence + '</text>';
    // console.log(row);
    // var className = "row" + row.rowNumber;
      // <div className={className}>
      // <svg ref="textContainer" className="textContainer" width="100%" height={this.state.charWidth} dangerouslySetInnerHTML={{__html: textHTML}} />
      //       <svg ref="reverseSequenceContainer" className="reverseSequenceContainer" width="100%" height={this.state.charWidth} dangerouslySetInnerHTML={{__html: textHTML}} />
    return (
        <div className="rowContainer"
          style={rowContainerStyle}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          >
            {this.state.showFeatures &&
              <AnnotationContainer
                annotationRanges={row.features}
                charWidth={this.state.charWidth}
                annotationHeight={this.state.ANNOTATION_HEIGHT}
                bpsPerRow={this.state.bpsPerRow}
                spaceBetweenAnnotations={this.state.SPACE_BETWEEN_ANNOTATIONS}/>
            }
            {this.state.showTranslations &&
              <AnnotationContainer
                annotationRanges={row.features}
                charWidth={this.state.charWidth}
                annotationHeight={this.state.ANNOTATION_HEIGHT}
                bpsPerRow={this.state.bpsPerRow}
                spaceBetweenAnnotations={this.state.SPACE_BETWEEN_ANNOTATIONS}/>
            }
            {this.state.showCutsites &&
              <CutsiteContainer
                annotationRanges={row.features}
                charWidth={this.state.charWidth}
                annotationHeight={this.state.ANNOTATION_HEIGHT}
                bpsPerRow={this.state.bpsPerRow}
                spaceBetweenAnnotations={this.state.SPACE_BETWEEN_ANNOTATIONS}/>
            }
            {this.state.showOrfs &&
              <OrfContainer
                row={row}
                annotationRanges={row.orfs}
                charWidth={this.state.charWidth}
                annotationHeight={this.state.ANNOTATION_HEIGHT}
                bpsPerRow={this.state.bpsPerRow}
                spaceBetweenAnnotations={this.state.SPACE_BETWEEN_ANNOTATIONS}/>
            }
            <SequenceContainer sequence={row.sequence} charWidth={this.state.charWidth}/>
            {this.state.showReverseSequence &&
              <SequenceContainer sequence={row.sequence.split('').reverse().join('')} charWidth={this.state.charWidth}/>
            }
            {this.state.showAxis &&
              <AxisContainer
              row={row}
              tickSpacing={this.state.tickSpacing}
              charWidth={this.state.charWidth}
              annotationHeight={this.state.ANNOTATION_HEIGHT}
              bpsPerRow={this.state.bpsPerRow}/>
            }
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
