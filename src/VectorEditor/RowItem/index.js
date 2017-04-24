import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';
import getOverlapsOfPotentiallyCircularRanges from 've-range-utils/getOverlapsOfPotentiallyCircularRanges';
import getSequenceWithinRange from 've-range-utils/getSequenceWithinRange';
import PassThrough from '../utils/PassThrough'
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString'
import React from 'react';
import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence'
import LineageLines from './LineageLines'
import DeletionLayers from './DeletionLayers'
import _Axis from './Axis'
import _Orfs from './Orfs'
import _Translations from './Translations'
import _Features from './Features'
import _Primers from './Primers'
import _CutsiteLabels from './CutsiteLabels'
import _Cutsites from './Cutsites'
import Caret from './Caret'
import pure from 'recompose/pure'
import './style.scss'
function noop() {}

class RowItem extends React.Component {
    render() {
        var {
            charWidth= 12,
            selectionLayer= {start: -1, end: -1},
            deletionLayers = {},
            replacementLayers = {},
            searchLayers=[],
            // setSelectionLayer = noop,
            cutsiteLabelSelectionLayer=[{start: -1, end: -1, color: 'black'}],
            annotationHeight=14,
            featureHeight=16,
            primerHeight=16,
            tickSpacing=10,
            sequenceHeight=16,
            spaceBetweenAnnotations=2,
            meta,
            width,
            annotationVisibility: {
                features: showFeatures= true,
                primers: showPrimers= true,
                // featureLabels: showFeatureLabels=true,
                translations: showTranslations= true,
                // translationLabels: showTranslationLabels=true,
                // parts: showParts= true,
                // partLabels: showPartLabels=true,
                orfs: showOrfs= true,
                lineageLines: showLineageLines= true,
                // orfLabels: showOrfLabels=true,
                cutsites: showCutsites= true,
                cutsiteLabels: showCutsiteLabels=true,
                axis: showAxis= true,
                yellowAxis: showYellowAxis= false,
                caret: showCaret= true,
                reverseSequence: showReverseSequence= true,
                sequence: showSequence= true,
            },
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
            fullSequence='',
            deletionLayerClicked=noop,
            deletionLayerRightClicked=noop,
            replacementLayerClicked=noop,
            replacementLayerRightClicked=noop,
            featureClicked=noop,
            featureRightClicked=noop,
            translationRightClicked=noop,
            primerClicked=noop,
            primerRightClicked=noop,
            selectionLayerRightClicked=noop,
            orfClicked=noop,
            orfRightClicked=noop,
            translationClicked=noop,
            translationDoubleClicked=noop,
            cutsiteClicked=noop,
            bpsPerRow,
            HoverHelper=PassThrough,
            componentOverrides={},
        } = this.props;
        var {
          sequence='',
          features= [],
          primers= [],
          translations= [],
        //   parts= [],
          cutsites= [],
          orfs= [],
        } = row
        var reverseSequence = getComplementSequenceString(sequence)
        if (!row) {
            return null;
        }
        var selectionLayers = [
          ...additionalSelectionLayers,
          ...Array.isArray(selectionLayer)
            ? selectionLayer
            : [selectionLayer]
       ]

        var {
            Sequence = _Sequence,
            Axis = _Axis,
            Orfs = _Orfs,
            Translations = _Translations,
            Features = _Features,
            Primers = _Primers,
            CutsiteLabels = _CutsiteLabels,
            Cutsites = _Cutsites,
            // Caret = _Caret,
        } = componentOverrides

        if (!width) {
            width = bpsPerRow * charWidth
        } else {
            charWidth = width / bpsPerRow
        }
        var rowContainerStyle = {
            position: "relative",
            width: width + 'px',
        };
        var annotationCommonProps = {
          HoverHelper,
          charWidth,
          bpsPerRow,
          sequenceLength,
          annotationHeight,
          spaceBetweenAnnotations,
          row
        }

        var deletionLayersToDisplay = flatMap({...replacementLayers, ...deletionLayers}, function (layer) {
            if (layer.caretPosition > -1) {
                return []
            }
            var overlaps = getOverlapsOfPotentiallyCircularRanges(layer, row, sequenceLength);
            return overlaps
        })
        var deletionLayerStrikeThrough = deletionLayersToDisplay.length ? deletionLayersToDisplay.map(function (layer) {
            var left = (layer.start - row.start) * charWidth
            var width = (layer.end - layer.start + 1) * charWidth
            return <div className={'ve_sequence_strikethrough'} 
            style={{
                left,
                width,
                top: 10,
                height: 2,
                position: 'absolute',
                background: 'black'
            }}></div>
        }) : null
                                
        return (
            <div className="veRowItem"
                style={rowContainerStyle}
                // onMouseMove={this.onMouseMove}
                // onMouseUp={this.onMouseUp}
                // onMouseDown={this.onMouseDown}
                >
                <div className='taSpacer'/>

                <SelectionLayer
                    color={'yellow'}
                    regions={searchLayers}
                    {...annotationCommonProps}
                />
                <SelectionLayer
                  selectionLayerRightClicked={selectionLayerRightClicked}
                  {...annotationCommonProps}
                  regions={selectionLayers}
                >
                </SelectionLayer>

                {(showFeatures && Object.keys(features).length > 0) &&
                  <Features
                    featureClicked={featureClicked}
                    featureRightClicked={featureRightClicked}
                    annotationRanges={features}
                    {...annotationCommonProps}
                    annotationHeight={featureHeight}
                    />
                }

                {(showPrimers && Object.keys(primers).length > 0) &&
                  <Primers
                    sequence={fullSequence}
                    primerClicked={primerClicked}
                    primerRightClicked={primerRightClicked}
                    annotationRanges={primers}
                    {...annotationCommonProps}
                    annotationHeight={primerHeight}
                    />
                }

                {(showOrfs && Object.keys(orfs).length > 0) &&
                  <Orfs
                    orfClicked={orfClicked}
                    orfRightClicked={orfRightClicked}
                    annotationRanges={orfs}
                    {...annotationCommonProps}
                    />
                }

                {(showTranslations && Object.keys(translations).length > 0) &&
                  <Translations
                    translationClicked={translationClicked}
                    translationRightClicked={translationRightClicked}
                    translationDoubleClicked={translationDoubleClicked}
                    annotationRanges={translations}
                    {...annotationCommonProps}
                    />
                }

                {(showCutsiteLabels && showCutsites && Object.keys(cutsites).length > 0) &&
                  <CutsiteLabels
                    cutsiteClicked={cutsiteClicked}
                    annotationRanges={cutsites}
                    {...annotationCommonProps}
                    />
                }
                
                <div className='veRowItemSequenceContainer' style={{position: 'relative'}}>
                    {showSequence && charWidth > 7 && <Sequence
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
                        {deletionLayerStrikeThrough}
                    </Sequence>
                    }

                    {showReverseSequence && charWidth > 7 &&
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
                            {deletionLayerStrikeThrough}
                        </Sequence>
                    }
                    {cutsiteLabelSelectionLayer.map(function (layer) {
                      return ''
                      var {color='black'} = layer
                        return layer.start > -1 &&
                        <SelectionLayer {...{
                            height: showReverseSequence ? sequenceHeight*2 + 1 : sequenceHeight + 1,
                            hideCarets:true,
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
                    {showCutsites && Object.keys(cutsites).map(function (id, index) {
                        var cutsite = cutsites[id]
                        var layer = cutsite.annotation.recognitionSiteRange
                        return layer.start > -1 &&
                        <SelectionLayer {...{
                            key: 'restrictionSiteRange' + index,
                            height: showReverseSequence ? sequenceHeight*2 + 1 : sequenceHeight + 1,
                            hideCarets:true,
                            opacity: .3,
                            className: 'cutsiteLabelSelectionLayer',
                            border: `2px solid ${'lightblue'}`,
                            // background: 'none',
                            background: 'lightblue',
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
                
                {map(replacementLayers,function (replacementLayer) {
                    var atCaret = replacementLayer.caretPosition  > -1
                    var normedCaretPos 
                    if (atCaret) {
                        normedCaretPos = normalizePositionByRangeLength(replacementLayer.caretPosition, sequenceLength)
                    }
                    var insertedBpsLayer = {
                        ...replacementLayer,
                        start: atCaret ? normedCaretPos : replacementLayer.start,  
                        end: (atCaret ? normedCaretPos : replacementLayer.start) + replacementLayer.sequence.length
                    }
                    var {sequence} = insertedBpsLayer
                    var layerRangeOverlaps = getOverlapsOfPotentiallyCircularRanges(insertedBpsLayer, row, sequenceLength)
                    return layerRangeOverlaps.map(function (layer,index) {
                        var isStart = layer.start === insertedBpsLayer.start
                        var seqInRow = getSequenceWithinRange({
                            start: layer.start - insertedBpsLayer.start,
                            end: layer.end - insertedBpsLayer.start,
                        }, sequence)
                        var startOffset = layer.start - row.start
                        var width = seqInRow.length * charWidth
                        var height = sequenceHeight
                        var bufferBottom = 4
                        var bufferLeft = 2
                        var arrowHeight = isStart ? 8 : 0
                        return <Sequence
                            key={index}
                            sequence={seqInRow}
                            startOffset={startOffset}
                            height={height}
                            containerStyle={{
                                marginTop: 8,
                                marginBottom: 6,
                            }}
                            length={seqInRow.length}
                            charWidth={charWidth}>
                            <svg style={{left: startOffset * charWidth, height: sequenceHeight, position: 'absolute'}} 
                                ref="rowViewTextContainer" 
                                onClick={function (event) {
                                  replacementLayerClicked({annotation: replacementLayer, event})
                                }}
                                onContextMenu={function (event) {
                                  replacementLayerRightClicked({annotation: replacementLayer,event})
                                }}
                                className="rowViewTextContainer clickable" width={width} height={height}>
                                <polyline points={`${-bufferLeft},0 ${-bufferLeft},${-arrowHeight}, ${charWidth/2},0 ${width},0 ${width},${height + bufferBottom} ${-bufferLeft},${height + bufferBottom} ${-bufferLeft},0`} fill="none" stroke="black" strokeWidth="2px"/>
                            </svg>
                        </Sequence>                 
                    })
                })}
                <DeletionLayers
                    deletionLayerClicked={deletionLayerClicked}
                    deletionLayerRightClicked={deletionLayerRightClicked}
                    deletionLayers={deletionLayers}
                    {...annotationCommonProps}
                />

                {
                    showYellowAxis && <svg width='100%' height='6px'>
                        <rect x="0" y="0" width='100%' height="6px" fill="#FFFFB3" stroke="grey" strokeWidth="1"/>
                    </svg>
                }
                {showAxis &&
                    <Axis
                      tickSpacing={tickSpacing}
                      {...annotationCommonProps}
                      />
                }

                {(caretPosition > -1 && showCaret) && 
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

// module.exports = pure(RowItem);
module.exports = RowItem;
