// import PassThrough from '../../utils/PassThrough'
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString'
import React from 'react';
// import SelectionLayer from './SelectionLayer';
// import _Sequence from './Sequence'
// import LineageLines from './LineageLines'
// import _Axis from './Axis'
// import _Orfs from './Orfs'
// import _Translations from './Translations'
// import _Features from './Features'
// import _CutsiteLabels from './CutsiteLabels'
// import _Cutsites from './Cutsites'
// import Caret from './Caret'

function noop() {

}

class RowItem extends React.Component {
    render() {
        var {
            charWidth= 12,
            selectionLayer= {start: -1, end: -1},
            searchLayers=[],
            cutsiteLabelSelectionLayer=[{start: -1, end: -1, color: 'black'}],
            annotationHeight=14,
            tickSpacing=10,
            sequenceHeight=16,
            spaceBetweenAnnotations=2,
            meta,
            width,
            additionalSelectionLayers=[],
            lineageLines=[],
            caretPosition= -1,
            sequenceLength= 0,
            row={
                sequence: '',
                start: 0,
                end: 0,
                rowNumber: 0,
            },
            bpsPerRow,
        } = this.props;

        var reverseSequence = getComplementSequenceString(sequence)
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
            // Caret = _Caret,
        } = componentOverrides

        var rowContainerStyle = {
            position: "relative",
            width: width + 'px',
        };
        var annotationCommonProps = {
          charWidth,
          bpsPerRow,
          sequenceLength,
          annotationHeight,
          spaceBetweenAnnotations,
          row
        }
        
        return (
            <div className="veRowItem"
                style={rowContainerStyle}
                // onMouseMove={this.onMouseMove}
                // onMouseUp={this.onMouseUp}
                // onMouseDown={this.onMouseDown}
                >
                <br></br>
                <SelectionLayer
                  {...annotationCommonProps}
                  regions={selectionLayers}
                >
                </SelectionLayer>
                {(showFeatures && Object.keys(features).length > 0) &&
                  <Features
                    featureClicked={featureClicked}
                    annotationRanges={features}
                    {...annotationCommonProps}
                    />
                }

                {(showOrfs && Object.keys(orfs).length > 0) &&
                  <Orfs
                    orfClicked={orfClicked}
                    annotationRanges={orfs}
                    {...annotationCommonProps}
                    />
                }

                {(showTranslations && Object.keys(translations).length > 0) &&
                  <Translations
                    translationClicked={translationClicked}
                    translationDoubleClicked={translationDoubleClicked}
                    annotationRanges={translations}
                    {...annotationCommonProps}
                    />
                }

                {(showCutsiteLabels && showCutsites && Object.keys(cutsites).length > 0) &&
                  <CutsiteLabels
                    onClick={cutsiteClicked}
                    annotationRanges={cutsites}
                    {...annotationCommonProps}
                    />
                }
                
                <div className='veRowItemSequenceContainer' style={{position: 'relative'}}>
                    <Sequence
                        sequence={sequence}
                        height={sequenceHeight}
                        length={sequence.length}
                        charWidth={charWidth}>
                        {(showCutsites && Object.keys(cutsites).length > 0) && <Cutsites
                            sequenceLength={sequenceLength}
                            annotationRanges={cutsites}
                            topStrand={true}
                            {...annotationCommonProps}
                            />}
                    </Sequence>

                    {showReverseSequence &&
                        <Sequence
                            length={sequence.length}
                            sequence={reverseSequence}
                            height={sequenceHeight}
                            charWidth={charWidth}>
                            {(showCutsites && Object.keys(cutsites).length > 0) && <Cutsites
                                                    topStrand={false}
                                                    annotationRanges={cutsites}
                                                    {...annotationCommonProps}
                                                    />}
                        </Sequence>
                    }
                    {cutsiteLabelSelectionLayer.map(function (layer) {
                      var {color='black'} = layer
                        return layer.start > -1 &&
                        <SelectionLayer {...{
                            height: showReverseSequence ? sequenceHeight*2 + 1 : sequenceHeight + 1,
                            showCarets:false,
                            opacity: .3,
                            className: 'cutsiteLabelSelectionLayer',
                            border: `2px solid ${color}`,
                            // background: 'none',
                            background: color,
                            regions:[layer]
                          }
                        }
                        {...annotationCommonProps}
                        />
                      })
                    }
                </div>

                {showLineageLines &&
                  <LineageLines
                  lineageLines={lineageLines}
                  {...annotationCommonProps}
                  />
                }
                {showAxis &&
                    <Axis
                      tickSpacing={tickSpacing}
                      {...annotationCommonProps}
                      />
                }
                <SelectionLayer
                    color={'yellow'}
                    regions={searchLayers}
                    {...annotationCommonProps}
                />
                {(caretPosition > -1) &&
                    <Caret
                        caretPosition={caretPosition}
                        shouldBlink={true}
                        {...annotationCommonProps}
                        />
                }
            </div>
        );
    }
}

module.exports = RowItem;