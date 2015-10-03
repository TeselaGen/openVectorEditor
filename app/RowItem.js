import React, {PropTypes} from 'react';
import {Component} from 'cerebral-react';

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

var RowItem = Component({
        charWidth: ['charWidth'],
        selectionLayer: ['selectionLayer'],
        annotationHeight: ['annotationHeight'],
        tickSpacing: ['tickSpacing'],
        spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
        showFeatures: ['showFeatures'],
        showTranslations: ['showTranslations'],
        showParts: ['showParts'],
        showOrfs: ['showOrfs'],
        showAxis: ['showAxis'],
        showCutsites: ['showCutsites'],
        showReverseSequence: ['showReverseSequence'],
        caretPosition: ['caretPosition'],
        sequenceLength: ['sequenceLength'],
        bpsPerRow: ['bpsPerRow']
    },
    {
    propTypes: {
        charWidth: PropTypes.number.isRequired,
        selectionLayer: PropTypes.number.isRequired,
        annotationHeight: PropTypes.number.isRequired,
        tickSpacing: PropTypes.number.isRequired,
        spaceBetweenAnnotations: PropTypes.number.isRequired,
        showFeatures: PropTypes.number.isRequired,
        showTranslations: PropTypes.number.isRequired,
        showParts: PropTypes.number.isRequired,
        showOrfs: PropTypes.number.isRequired,
        showAxis: PropTypes.number.isRequired,
        showCutsites: PropTypes.number.isRequired,
        showReverseSequence: PropTypes.number.isRequired,
        caretPosition: PropTypes.number.isRequired,
        sequenceLength: PropTypes.number.isRequired,
        bpsPerRow: PropTypes.number.isRequired,
        
        row: PropTypes.number.isRequired
    },
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
            caretPosition,
            sequenceLength,
            bpsPerRow,
            row,
            signals,
        } = this.props;
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
                    row={row}
                    signals={signals}
                    annotationRanges={row.features}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}
                    />
                }
            
                {(showOrfs && row.orfs.length > 0) &&
                  <OrfContainer
                    row={row}
                    signals={signals}
                    annotationRanges={row.orfs}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                {(showTranslations && row.translations.length > 0) &&
                  <TranslationContainer
                    row={row}
                    signals={signals}
                    annotationRanges={row.translations}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }

                {(showCutsites && row.cutsites.length > 0) &&
                  <CutsiteLabelContainer
                    annotationRanges={row.cutsites}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                <SequenceContainer 
                    sequence={row.sequence} 
                    charWidth={charWidth}>
                    {(showCutsites && row.cutsites.length > 0) && <CutsiteSnipsContainer
                        row={row}
                        signals={signals}
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
                                                signals={signals}
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
                    signals={signals}
                    tickSpacing={tickSpacing}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}/>
                }
                <HighlightLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    signals={signals}
                    sequenceLength={sequenceLength}
                    selectionLayer={selectionLayer}
                >
                </HighlightLayer>
                <Caret 
                    caretPosition={caretPosition} 
                    charWidth={charWidth}
                    row={row}
                    signals={signals}
                    sequenceLength={sequenceLength}
                    shouldBlink={true}
                    />
            </div>
        );
    }
});

module.exports = RowItem;