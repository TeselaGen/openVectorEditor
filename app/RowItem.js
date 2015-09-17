import React, {
    PropTypes
}
from 'react';
var Blink = require('react-blink');
var assign = require('lodash/object/assign');
var getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');
// var baobabBranch = require('baobab-react/mixins').branch;
var getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');

var SequenceContainer = require('./SequenceContainer');
var AxisContainer = require('./AxisContainer');
var OrfContainer = require('./OrfContainer');
var TranslationContainer = require('./TranslationContainer');
var FeatureContainer = require('./FeatureContainer');
var CutsiteContainer = require('./CutsiteContainer');
var CutsiteSnipsContainer = require('./CutsiteSnipsContainer');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var RowItem = React.createClass({
    mixins: [PureRenderMixin],
    render: function() {
        var {
            charWidth,
            selectionLayer,
            ANNOTATION_HEIGHT,
            tickSpacing,
            SPACE_BETWEEN_ANNOTATIONS,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            row
        } = this.props;
        if (!row) {
            return null;
        }
        var fontSize = charWidth + "px";
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

        var startSelectionCursor;
        var endSelectionCursor;
        var highlightLayerForRow = getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, charWidth, cursorStyle, sequenceLength);

        function getHighlightLayerForRow(selectionLayer, row, bpsPerRow, highlightLayerStyle, charWidth, cursorStyle, sequenceLength) {
            if (selectionLayer.selected) {
                var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row, sequenceLength);
                var selectionLayers = overlaps.map(function(overlap, index) {
                    if (overlap.start === selectionLayer.start) {
                        startSelectionCursor = getCursorForRow(overlap.start, row, bpsPerRow, cursorStyle, charWidth, !selectionLayer.cursorAtEnd);
                    }
                    if (overlap.end === selectionLayer.end) {
                        endSelectionCursor = getCursorForRow(overlap.end + 1, row, bpsPerRow, cursorStyle, charWidth, selectionLayer.cursorAtEnd);
                    }
                    var result = getXStartAndWidthOfRowAnnotation(overlap, bpsPerRow, charWidth);
                    var xStart = result.xStart;
                    var width = result.width;

                    var style = assign({}, highlightLayerStyle, {
                        width: width,
                        left: xStart
                    });
                    return (<div key={index} className="selectionLayer" style={style}/>);
                });
                return selectionLayers;
            }
        }

        var cursor = getCursorForRow(caretPosition, row, bpsPerRow, cursorStyle, charWidth, true);

        function getCursorForRow(caretPosition, row, bpsPerRow, cursorStyle, charWidth, shouldBlink) {
            if (row.start <= caretPosition && row.end + 1 >= caretPosition || (row.end === sequenceLength - 1 && row.end < caretPosition)) {
                //the second logical operator catches the special case where we're at the very end of the sequence..
                var newCursorStyle = assign({}, cursorStyle, {
                    left: (caretPosition - row.start) * charWidth
                });
                var cursorEl = <div className="cursor" style={newCursorStyle}/>
                if (shouldBlink) {
                    return (<Blink duration={600}>{cursorEl}</Blink>);
                } else {
                    return (cursorEl);
                }
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
            {(showFeatures && row.features.length > 0) &&
              <FeatureContainer
                annotationRanges={row.features}
                charWidth={charWidth}
                annotationHeight={ANNOTATION_HEIGHT}
                bpsPerRow={bpsPerRow}
                spaceBetweenAnnotations={SPACE_BETWEEN_ANNOTATIONS}/>
            }
            
            {(showOrfs && row.orfs.length > 0) &&
              <OrfContainer
                row={row}
                annotationRanges={row.orfs}
                charWidth={charWidth}
                annotationHeight={ANNOTATION_HEIGHT}
                bpsPerRow={bpsPerRow}
                sequenceLength={sequenceLength}
                spaceBetweenAnnotations={SPACE_BETWEEN_ANNOTATIONS}/>
            }
            {(showTranslations && row.translations.length > 0) &&
              <TranslationContainer
                row={row}
                annotationRanges={row.translations}
                charWidth={charWidth}
                annotationHeight={ANNOTATION_HEIGHT}
                bpsPerRow={bpsPerRow}
                sequenceLength={sequenceLength}
                spaceBetweenAnnotations={SPACE_BETWEEN_ANNOTATIONS}/>
            }

            {(showCutsites && row.cutsites.length > 0) &&
              <CutsiteContainer
                annotationRanges={row.cutsites}
                charWidth={charWidth}
                annotationHeight={ANNOTATION_HEIGHT}
                bpsPerRow={bpsPerRow}
                spaceBetweenAnnotations={SPACE_BETWEEN_ANNOTATIONS}/>
            }
            <SequenceContainer 
                sequence={row.sequence} 
                charWidth={charWidth}>
                <CutsiteSnipsContainer
                    row={row}
                    sequenceLength={sequenceLength}
                    annotationRanges={row.cutsites}
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    topStrand={true}
                    />
            </SequenceContainer>

            {showReverseSequence &&
                <SequenceContainer sequence={row.sequence.split('').reverse().join('')} charWidth={charWidth}>
                    <CutsiteSnipsContainer
                        row={row}
                        sequenceLength={sequenceLength}
                        annotationRanges={row.cutsites}
                        charWidth={charWidth}
                        bpsPerRow={bpsPerRow}
                        topStrand={false}
                        />
                </SequenceContainer>
            }
            {showAxis &&
                <AxisContainer
                row={row}
                tickSpacing={tickSpacing}
                charWidth={charWidth}
                annotationHeight={ANNOTATION_HEIGHT}
                bpsPerRow={bpsPerRow}/>
            }
            {highlightLayerForRow}
            {startSelectionCursor}
            {endSelectionCursor}
            {cursor}
        </div>
        );
    }
});

module.exports = RowItem;