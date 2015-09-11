var React = require('react');
var assign = require('lodash/object/assign');
var getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
var baobabBranch = require('baobab-react/mixins').branch;
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');

var SequenceContainer = require('./SequenceContainer');
var AxisContainer = require('./AxisContainer');
var OrfContainer = require('./OrfContainer');
var TranslationContainer = require('./TranslationContainer2');
var FeatureContainer = require('./FeatureContainer');

var RowItem = React.createClass({
  mixins: [baobabBranch],
  cursors: {
    charWidth: ['charWidth'],
    CHAR_HEIGHT: ['CHAR_HEIGHT'], //potentially unneeded
    ANNOTATION_HEIGHT: ['ANNOTATION_HEIGHT'],
    tickSpacing: ['tickSpacing'],
    SPACE_BETWEEN_ANNOTATIONS: ['SPACE_BETWEEN_ANNOTATIONS'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showReverseSequence: ['showReverseSequence'],
    // sequenceData: ['sequenceData'],
    selectionLayer: ['selectionLayer'],
    mouse: ['mouse'],
    caretPosition: ['caretPosition'],
    sequenceLength: ['$sequenceLength'],
    bpsPerRow: ['$bpsPerRow']
  },

  render: function () {
    var row = this.props.row;
    if (!row) {
      return null;
    }
    var bpsPerRow = this.state.bpsPerRow;
    var showParts = this.state.showParts;
    // var showReverseSequence = this.state.showReverseSequence;
    var selectionLayer = this.state.selectionLayer;
    var caretPosition = this.state.caretPosition;
    var self = this;


    var fontSize = this.state.charWidth + "px";
    var highlightLayerStyle = {
      height: "98%",
      background: 'blue',
      position: "absolute",
      top: "0",
      opacity: ".3",
    };

    var cursorStyle = {
      height: "98%",
      background: 'black',
      position: "absolute",
      top: "0",
      width: "2px",
      cursor: "ew-resize",
    };

    var selectionCursorStart;
    var selectionCursorEnd;
    var highlightLayerForRow = getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, this.state.charWidth, cursorStyle, this.state.sequenceLength);
    
    function getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, charWidth, cursorStyle, sequenceLength) {
      if (selectionLayer.selected) {
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

    return (
        <div className="rowContainer"
          style={rowContainerStyle}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          >
            {this.state.showFeatures &&
              <FeatureContainer
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

module.exports = RowItem;
