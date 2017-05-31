import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import React from 'react';
import Draggable from 'react-draggable';
import { Decorator as Cerebral } from 'cerebral-view-react';
import { columnizeString, elementWidth, calculateRowLength } from '../utils';
import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence';
import _Orfs from './Orfs';
import _AminoAcids from './AminoAcids';
import _Features from './Features';
import _CutsiteLabels from './Cutsites/CutsiteLabels';
import _Cutsites from './Cutsites';
import Caret from './Caret';
import Highlight from './Highlight';
import styles from './RowItem.scss';

function noop() {

}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    charWidth: ['charWidth'],
    caretPosition: ['caretPosition'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    cutsites: ['cutsites'],
    cutsitesByName: ['cutsitesByName'],
    letterSpacing: ['letterSpacing'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    searchLayers: ['searchLayers'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceHeight: ['sequenceHeight'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showAminoAcids: ['showAminoAcids'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
})

class RowItem extends React.Component {

    render() {
        var {
            annotationHeight,
            bpsPerRow,
            caretPosition,
            charWidth,
            className,
            componentOverrides={},
            letterDistance,
            row,
            searchLayers=[],
            searchRows,
            selectionLayer={start: -1, end: -1},
            sequenceData,
            sequenceHeight,
            sequenceLength,
            showAminoAcids,
            showCutsites,
            showFeatures,
            showOrfs,
            showReverseSequence,
            signals,
            spaceBetweenAnnotations,
            tickSpacing,
            width,
            selectionStart,
            selectionEnd,
        } = this.props;

        if (!row) {
            return null;
        }

        var {
            sequence='',
            features= [],
            translations= [],
            cutsites= [],
            orfs= [],
        } = row

        var reverseSequence = getComplementSequenceString(sequence);

        //extend the entire sequence by 2 bps around the origin in both directions for amino acids
        var lastTwoBps = sequenceData.sequence.slice(sequenceData.sequence.length - 2, sequenceData.sequence.length);
        var firstTwoBps = sequenceData.sequence.slice(0,2);
        var wrappedSequence = lastTwoBps + sequenceData.sequence + firstTwoBps;

        // extended each row by 2 bps in both directions for amino acids
        var addOnBpsLeft = wrappedSequence.slice(row.start,row.start+2);
        var addOnBpsRight = wrappedSequence.slice(row.start+sequence.length+2,row.start+sequence.length+4);
        var aminoAcidSequence = addOnBpsLeft + sequence + addOnBpsRight;
        var reverseAminoAcidSequence = getComplementSequenceString(aminoAcidSequence);

        var {
            Sequence = _Sequence,
        //     Axis = _Axis,
            Orfs = _Orfs,
        //     Translations = _Translations,
            Features = _Features,
            CutsiteLabels = _CutsiteLabels,
            Cutsites = _Cutsites,
            AminoAcids = _AminoAcids,
        } = componentOverrides

        var annotationCommonProps = {
            bpsPerRow,
            charWidth,
            letterDistance,
            row,
            sequenceHeight,
            sequenceLength,
            annotationHeight,
            signals,
        }

        var rowNumber = row.start + 1; // we want to start at 1 and not 0

        var selectedStuff = [];

        // nothing selected, just put a caret at position 0
        if (caretPosition !== -1 && !selectionLayer.selected) {
            selectedStuff.push(
                <Caret
                    row = {row}
                    sequenceLength = {sequenceLength}
                    caretPosition = {caretPosition}
                    />
            );
        }

        var searchHighlight = [];
        if (searchRows && searchRows.length > 0) {
            let i = 0;
            searchRows.forEach(function(result) {
                searchHighlight.push(
                    <Highlight key={i} start={result.start} end={result.end} rowStart={row.start} rowEnd={row.end} color={"yellow"}/>
                );
                i += 1;
            });
        } else {
            searchHighlight = <div></div>;
        }

        return (
            <div id={Math.floor(row.start / bpsPerRow)} // id is row-number
                className={"veRowItem", styles.rowItem}>

                <div className={styles.margin}>
                    { rowNumber }
                </div>

                {(showFeatures && Object.keys(features).length > 0) &&
                    <Features
                        annotationRanges={features}
                        {...annotationCommonProps}
                        />
                }

                {(showOrfs && Object.keys(orfs).length > 0) &&
                    <Orfs
                        annotationRanges={orfs}
                        signals={signals}
                        {...annotationCommonProps}
                        />
                }

                {(showAminoAcids) &&
                    <AminoAcids
                        sequence={aminoAcidSequence}
                        sequenceData={sequenceData}
                        rowNumber={Math.floor(row.start / bpsPerRow)}
                        topStrand={true}
                        {...annotationCommonProps}
                        />
                }

                {(showCutsites && Object.keys(cutsites).length > 0) &&
                    <CutsiteLabels
                        annotationRanges={cutsites}
                        {...annotationCommonProps}
                        />
                }

                {(showCutsites && Object.keys(cutsites).length > 0) &&
                    <div style={{position:'fixed'}}>
                    <Cutsites
                        sequenceLength={sequenceLength}
                        annotationRanges={cutsites}
                        topStrand={true}
                        showAminoAcids={showAminoAcids}
                        showReverseSequence={showReverseSequence}
                        {...annotationCommonProps}
                        />
                    <Cutsites
                        sequenceLength={sequenceLength}
                        annotationRanges={cutsites}
                        topStrand={false}
                        showAminoAcids={showAminoAcids}
                        showReverseSequence={showReverseSequence}
                        {...annotationCommonProps}
                        />
                    </div>
                }


                { selectionStart }
                <Highlight start={selectionLayer.start} end={selectionLayer.end} rowStart={row.start} rowEnd={row.end} />
                { selectionEnd }

                { searchHighlight }

                <div className='veRowItemSequenceContainer'>
                    <Sequence
                        reverse="false"
                        sequence={sequence}
                        {...annotationCommonProps}
                        >
                    </Sequence>

                    {showReverseSequence &&
                        <Sequence
                            reverse="true"
                            sequence={reverseSequence}
                            {...annotationCommonProps}
                            >
                        </Sequence>
                    }
                </div>

                {(showAminoAcids && showReverseSequence) &&
                    <AminoAcids
                        sequence={reverseAminoAcidSequence}
                        sequenceData={sequenceData}
                        rowNumber={Math.floor(row.start / bpsPerRow)}
                        topStrand={false}
                        {...annotationCommonProps}
                        />
                }

            </div>
        );
    }
}

module.exports = RowItem;
