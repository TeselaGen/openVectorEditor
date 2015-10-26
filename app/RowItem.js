import React, {PropTypes} from 'react';
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import SequenceContainer from './SequenceContainer';
import AxisContainer from './AxisContainer';
import OrfContainer from './OrfContainer';
import TranslationContainer from './TranslationContainer';
import FeatureContainer from './FeatureContainer';
import CutsiteLabelContainer from './CutsiteLabelContainer';
import CutsiteSnipsContainer from './CutsiteSnipsContainer';
import HighlightLayer from './HighlightLayer';
import Caret from './Caret';

class RowItem extends React.Component {
    render() {
        var {
            charWidth,
            selectionLayer,
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
                    signals={signals}
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
                    <SequenceContainer sequence={ getComplementSequenceString(row.sequence)} charWidth={charWidth}>
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
                <HighlightLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    color={'green'}
                    signals={signals}
                    sequenceLength={sequenceLength}
                    selectionLayer={cutsiteLabelSelectionLayer}
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
    row: PropTypes.object.isRequired
};

export default RowItem;