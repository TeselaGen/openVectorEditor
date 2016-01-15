import React, {PropTypes} from 'react';
import HighlightLayer from './HighlightLayer';

var getComplementSequenceString = require('ve-sequence-utils/getComplementSequenceString');
var SequenceContainer = require('./SequenceContainer');
var AxisContainer = require('./AxisContainer');
var OrfContainer = require('./OrfContainer');
var TranslationContainer = require('./TranslationContainer');
var FeatureContainer = require('./FeatureContainer');
var CutsiteLabelContainer = require('./CutsiteLabelContainer');
var CutsiteSnipsContainer = require('./CutsiteSnipsContainer');
var Caret = require('./Caret');

class RowItem extends React.Component {
    render() {
        var {
            charWidth,
            selectionLayer,
            searchLayers,
            cutsiteLabelSelectionLayer,
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
            uppercase,
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

        var sequence = (uppercase) ? row.sequence.toUpperCase() : row.sequence.toLowerCase();

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
                    signals={signals}
                    annotationRanges={row.cutsites}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                <SequenceContainer 
                    sequence={sequence} 
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
                    <SequenceContainer sequence={ getComplementSequenceString(sequence)} charWidth={charWidth}>
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
                    regions={[selectionLayer]}
                >
                </HighlightLayer>
                <HighlightLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    color={'green'}
                    signals={signals}
                    sequenceLength={sequenceLength}
                    regions={[cutsiteLabelSelectionLayer]}
                >
                </HighlightLayer>
                <HighlightLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    color={'yellow'}
                    signals={signals}
                    sequenceLength={sequenceLength}
                    regions={searchLayers}
                >
                </HighlightLayer>
                {!selectionLayer.selected && 
                    <Caret 
                        caretPosition={caretPosition} 
                        charWidth={charWidth}
                        row={row}
                        signals={signals}
                        sequenceLength={sequenceLength}
                        shouldBlink={true}
                        />
                }
            </div>
        );
    }
}

RowItem.propTypes = {
    charWidth: PropTypes.number.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    cutsiteLabelSelectionLayer: PropTypes.object.isRequired,
    annotationHeight: PropTypes.number.isRequired,
    tickSpacing: PropTypes.number.isRequired,
    spaceBetweenAnnotations: PropTypes.number.isRequired,
    showFeatures: PropTypes.bool.isRequired,
    showTranslations: PropTypes.bool.isRequired,
    showParts: PropTypes.bool.isRequired,
    showOrfs: PropTypes.bool.isRequired,
    showAxis: PropTypes.bool.isRequired,
    showCutsites: PropTypes.bool.isRequired,
    showReverseSequence: PropTypes.bool.isRequired,
    caretPosition: PropTypes.number.isRequired,
    sequenceLength: PropTypes.number.isRequired,
    bpsPerRow: PropTypes.number.isRequired,
    uppercase: PropTypes.bool.isRequired,
    row: PropTypes.object.isRequired
};

module.exports = RowItem;
