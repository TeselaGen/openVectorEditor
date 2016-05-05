import getReverseComplementSequenceString from 've-sequence-utils/getReverseComplementSequenceString'
import React, {PropTypes} from 'react';
import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence'
import _Axis from './Axis'
import _Orfs from './Orfs'
import _Translations from './Translations'
import _Features from './Features'
import _CutsiteLabels from './CutsiteLabels'
import _Cutsites from './Cutsites'
import _Caret from './Caret'
import HoverHelper from '../../HoverHelper';

function noop(argument) {
    //console.log('noop!');
}

class RowItem extends React.Component {
    render() {
        var {
            charWidth= 12,
            selectionLayer= {start: -1, end: -1},
            searchLayers=[],
            setSelectionLayer = noop,
            cutsiteLabelSelectionLayer={start: -1, end: -1, color: 'black'},
            annotationHeight=12,
            tickSpacing=10,
            sequenceHeight=14,
            spaceBetweenAnnotations=12,
            annotationVisibility: {
                features: showFeatures= false,
                featureLabels: showFeatureLabels=false,
                translations: showTranslations= false,
                translationLabels: showTranslationLabels=false,
                parts: showParts= false,
                partLabels: showPartLabels=false,
                orfs: showOrfs= false,
                orfLabels: showOrfLabels=false,
                cutsites: showCutsites= false,
                cutsiteLabels: showCutsiteLabels=false,
                axis: showAxis= false,
                reverseSequence: showReverseSequence= true,
            },
            caretPosition= -1,
            sequenceLength= 0,
            bpsPerRow= 0,
            HoverHelper=HoverHelper,
            row={
                sequence: '',
                start: 0,
                end: 0,
                rowNumber: 0,
                features: [],
                parts: [],
                cutsites: [],
                orfs: [],
            },
            signals,
            componentOverrides={},

        } = this.props;
        var {sequence} = row
        var reverseSequence = getReverseComplementSequenceString(sequence)
        if (!row) {
            return null;
        }

        var {
            Sequence = _Sequence,
            Axis = _Axis,
            Orfs = _Orfs,
            Translations = _Translations,
            Features = _Features,
            CutsiteLabels = _CutsiteLabels,
            Cutsites = _Cutsites,
            Caret = _Caret,
        } = componentOverrides

        var fontSize = charWidth + "px";
        
        var rowContainerStyle = {
            // overflow: "hidden",
            position: "relative",
            width: "100%",
        };

        //console.log('selectionLayer: ' + JSON.stringify(selectionLayer,null,4));
        return (
            <div className="rowContainer"
                style={rowContainerStyle}
                // onMouseMove={this.onMouseMove}
                // onMouseUp={this.onMouseUp}
                // onMouseDown={this.onMouseDown}
                >
                <br></br>
                {(showFeatures && Object.keys(row.features).length > 0) &&
                  <Features
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
            
                {(showOrfs && Object.keys(row.orfs).length > 0) &&
                  <Orfs
                    row={row}
                    signals={signals}
                    annotationRanges={row.orfs}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                {(showTranslations && Object.keys(row.translations).length > 0) &&
                  <Translations
                    row={row}
                    setSelectionLayer={setSelectionLayer}
                    // signals={signals}
                    annotationRanges={row.translations}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                <SelectionLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    sequenceLength={sequenceLength}
                    regions={Array.isArray(selectionLayer) 
                        ? selectionLayer
                        : [selectionLayer]
                    }
                >
                </SelectionLayer>

                {(showCutsiteLabels && Object.keys(row.cutsites).length > 0) &&
                  <CutsiteLabels
                    signals={signals}
                    annotationRanges={row.cutsites}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                <div classname='veRowItemSequenceContainer' style={{position: 'relative'}}>
                    <Sequence 
                        sequence={sequence}
                        height={sequenceHeight}
                        length={row.sequence.length} 
                        charWidth={charWidth}>
                        {(showCutsites && Object.keys(row.cutsites).length > 0) && <Cutsites
                            row={row}
                            sequenceLength={sequenceLength}
                            annotationRanges={row.cutsites}
                            charWidth={charWidth}
                            bpsPerRow={bpsPerRow}
                            topStrand={true}
                            />}
                    </Sequence>

                    {showReverseSequence &&
                        <Sequence 
                            length={row.sequence.length} 
                            sequence={reverseSequence} 
                            height={sequenceHeight}
                            charWidth={charWidth}>
                            {(showCutsites && Object.keys(row.cutsites).length > 0) && <Cutsites
                                                    row={row}
                                                    sequenceLength={sequenceLength}
                                                    annotationRanges={row.cutsites}
                                                    charWidth={charWidth}
                                                    bpsPerRow={bpsPerRow}
                                                    topStrand={false}
                                                    />}
                        </Sequence>
                    }
                    {cutsiteLabelSelectionLayer.start > -1 && 
                        <SelectionLayer {...{
                            charWidth,
                            height: showReverseSequence ? sequenceHeight*2 + 1 : sequenceHeight + 1,
                            showCarets:false,
                            bpsPerRow,
                            row,
                            opacity: .3,
                            className: 'cutsiteLabelSelectionLayer',
                            border: `2px solid ${cutsiteLabelSelectionLayer.color}`,
                            // background: 'none',
                            background: cutsiteLabelSelectionLayer.color,
                            sequenceLength,
                            regions:[cutsiteLabelSelectionLayer]
                        }}
                        />
                    }
                </div>

                {showAxis &&
                    <Axis {
                        ...{
                            row,
                            tickSpacing,
                            charWidth,
                            annotationHeight,
                            bpsPerRow,
                            sequenceLength
                        }
                    }
                    />
                }
                
                
                <SelectionLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    color={'yellow'}
                    sequenceLength={sequenceLength}
                    regions={searchLayers}
                />
                {!(caretPosition > -1) && 
                    <Caret 
                        caretPosition={caretPosition} 
                        charWidth={charWidth}
                        row={row}
                        sequenceLength={sequenceLength}
                        shouldBlink={true}
                        />
                }
            </div>
        );
    }
}

module.exports = RowItem;
