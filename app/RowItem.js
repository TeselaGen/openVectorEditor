import React, {
    PropTypes
}
from 'react';
var SequenceContainer = require('./SequenceContainer');
var AxisContainer = require('./AxisContainer');
var OrfContainer = require('./OrfContainer');
var TranslationContainer = require('./TranslationContainer');
var FeatureContainer = require('./FeatureContainer');
var CutsiteLabelContainer = require('./CutsiteLabelContainer');
var CutsiteSnipsContainer = require('./CutsiteSnipsContainer');
var HighlightLayer = require('./HighlightLayer');
var Caret = require('./Caret');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var RowItem = React.createClass({
    mixins: [PureRenderMixin],
    render: function() {
        var {
            charWidth,
            selectionLayer,
            annotationHeight,
            tickSpacing,
            spaceBetweenAnnotations,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            setSelectionLayer,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            row
        } = this.props;
        debugger;
        if (!row) {
            return null;
        }
        var fontSize = charWidth + "px";
        
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
                    setSelectionLayer={setSelectionLayer}
                    annotationRanges={row.features}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
            
                {(showOrfs && row.orfs.length > 0) &&
                  <OrfContainer
                    setSelectionLayer={setSelectionLayer}
                    row={row}
                    annotationRanges={row.orfs}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                {(showTranslations && row.translations.length > 0) &&
                  <TranslationContainer
                    setSelectionLayer={setSelectionLayer}
                    row={row}
                    annotationRanges={row.translations}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }

                {(showCutsites && row.cutsites.length > 0) &&
                  <CutsiteLabelContainer
                    setSelectionLayer={setSelectionLayer}
                    annotationRanges={row.cutsites}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                <SequenceContainer 
                    setSelectionLayer={setSelectionLayer}
                    sequence={row.sequence} 
                    charWidth={charWidth}>
                    {(showCutsites && row.cutsites.length > 0) && <CutsiteSnipsContainer
                            setSelectionLayer={setSelectionLayer}
                        row={row}
                        sequenceLength={sequenceLength}
                        annotationRanges={row.cutsites}
                        charWidth={charWidth}
                        bpsPerRow={bpsPerRow}
                        topStrand={true}
                        />}
                </SequenceContainer>

                {showReverseSequence &&
                    <SequenceContainer sequence={row.sequence.split('').reverse().join('')} charWidth={charWidth}>
                        {(showCutsites && row.cutsites.length > 0) && <CutsiteSnipsContainer
                                                row={row}
                                                sequenceLength={sequenceLength}
                                                annotationRanges={row.cutsites}
                                                charWidth={charWidth}
                                                bpsPerRow={bpsPerRow}
                                                topStrand={false}
                                                />}
                    </SequenceContainer>
                }
                {showAxis &&
                    <AxisContainer
                    row={row}
                    tickSpacing={tickSpacing}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}/>
                }
                <HighlightLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    sequenceLength={sequenceLength}
                    selectionLayer={selectionLayer}
                >
                </HighlightLayer>
                <Caret 
                    caretPosition={caretPosition} 
                    charWidth={charWidth}
                    row={row}
                    sequenceLength={sequenceLength}
                    shouldBlink={true}
                    />
            </div>
        );
    }
});

module.exports = RowItem;