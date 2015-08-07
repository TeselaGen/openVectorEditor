var React = require('react');
var assign = require('lodash/object/assign');
var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var baobabBranch = require('baobab-react/mixins').branch;
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');

var SequenceContainer = require('./SequenceContainer');
var AxisContainer = require('./AxisContainer');
var OrfContainer = require('./OrfContainer');
var TranslationContainer = require('./TranslationContainer');
var AnnotationContainer = require('./AnnotationContainer');

var RowItem = React.createClass({
  mixins: [baobabBranch],
  cursors: {
    charWidth: ['vectorEditorState', 'charWidth'],
    CHAR_HEIGHT: ['vectorEditorState', 'CHAR_HEIGHT'], //potentially unneeded
    ANNOTATION_HEIGHT: ['vectorEditorState', 'ANNOTATION_HEIGHT'],
    tickSpacing: ['vectorEditorState', 'tickSpacing'],
    SPACE_BETWEEN_ANNOTATIONS: ['vectorEditorState', 'SPACE_BETWEEN_ANNOTATIONS'],
    showFeatures: ['vectorEditorState', 'showFeatures'],
    showTranslations: ['vectorEditorState', 'showTranslations'],
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
    var row = this.props.row;
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
      height: "98%",
      // width: "100%",
      background: 'blue',
      position: "absolute",
      top: "0",
      // left: "0",
      // fillOpacity: ".3",
      opacity: ".3",
    };

    var cursorStyle = {
      height: "98%",
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
        var result = getXStartAndWidthOfRowAnnotation(overlap, bpsPerRow, charWidth);
        var xStart = result.xStart;
        var width = result.width;

        var style = assign({}, highlightLayerStyle, {width: width, left: xStart});
        return (<div key={index} className="selectionLayer" style={style}/>);
      });
      return selectionLayers;
    }

    var cursor = getCursorForRow(caretPosition, row, bpsPerRow, cursorStyle, this.state.charWidth);
    function getCursorForRow (caretPosition, row, bpsPerRow, cursorStyle, charWidth) {
      if(row.start <= caretPosition && row.end + 1 >= caretPosition || (row.end === self.state.sequenceLength - 1 && row.end < caretPosition) ) {
        //the second logical operator catches the special case where we're at the very end of the sequence..
        var newCursorStyle = assign({}, cursorStyle, {left: (caretPosition - row.start) * charWidth});
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
    // if (row.translations.length && showTranslations) {
    //   debugger;
    // }
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
                sequenceLength={this.state.sequenceLength}
                spaceBetweenAnnotations={this.state.SPACE_BETWEEN_ANNOTATIONS}/>
            }
            {this.state.showTranslations &&
              <TranslationContainer
                row={row}
                annotationRanges={row.translations}
                charWidth={this.state.charWidth}
                annotationHeight={this.state.ANNOTATION_HEIGHT}
                bpsPerRow={this.state.bpsPerRow}
                sequenceLength={this.state.sequenceLength}
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
