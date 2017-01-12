/* structure of row object
   note start of sequence is 0


obj
    - cutsites[]
        - length: number
        Object:
        - annotation [object of type]
        - enclosingRangeType : string
        - end : number
        - id : ?
        - start : number
        - yOffset : number
    - end : number
    - features[]
    - orfs []
    - parts [] // unused by us
    - rowNumber : number
    - sequence : string
    - start : number
    - translations [] // also unused right now
*/

// import PassThrough from '../../utils/PassThrough'
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString'
import React from 'react';
import Draggable from 'react-draggable'
import { Decorator as Cerebral } from 'cerebral-view-react';
import { columnizeString, elementWidth, calculateRowLength } from '../utils';
import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence'
// import LineageLines from './LineageLines'
// import _Axis from './Axis'
import _Orfs from './Orfs'
// import _Translations from './Translations'
import _Features from './Features'
import _CutsiteLabels from './Cutsites/CutsiteLabels'
import _Cutsites from './Cutsites'
import Caret from './Caret'
import styles from './RowItem.scss';

function noop() {

}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],     
    charWidth: ['charWidth'], 
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],    
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],         
    cutsites: ['cutsites'],
    cutsitesByName: ['cutsitesByName'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']     
})

class RowItem extends React.Component {

    render() {
        var {
            charWidth,
            selectionLayer={start: -1, end: -1},
            searchLayers=[],
            sequenceData,
            annotationHeight,
            tickSpacing,
            showCutsites,
            showReverseSequence,
            sequenceHeight,
            spaceBetweenAnnotations,
            width,
            additionalSelectionLayers=[],
            caretPosition,
            sequenceLength,
            row,
            showFeatures,
            showOrfs,
            bpsPerRow,
            componentOverrides = {},
            className,
            signals
        } = this.props;
        
        var {
            sequence='',
            features= [],
            translations= [],
            cutsites= [],
            orfs= []
        } = row

        var reverseSequence = getComplementSequenceString(sequence)

        if (!row) {
            return null;
        }

        var {
            Sequence = _Sequence,
        //     Axis = _Axis,
            Orfs = _Orfs,
        //     Translations = _Translations,
            Features = _Features,
            CutsiteLabels = _CutsiteLabels,
            Cutsites = _Cutsites,
        } = componentOverrides

        var annotationCommonProps = {
            charWidth,
            bpsPerRow,
            sequenceLength,
            annotationHeight,
            spaceBetweenAnnotations,
            row
        }

        var rowNumber = row.start + 1; // we want to start at 1 and not 0

        var selectedStuff = [];

        if (selectionLayer.selected) {

        //     selectedLayer.push(
        //         <div
        //             key='veSelectionLayer' 
        //             className='veSelectionLayer'
        //             start={ start }
        //             end={ end }
        //             height={ 0 }
        //             >
        //             <path
        //                 style={{ opacity: .4}}
        //                 d={ sector.path.print() }
        //                 fill="blue" 
        //                 />
        //         </div>
        //     );
        //     selectedLayer.push(
        //         <Caret 
        //             key='caretStart'
        //             caretPosition={selectionLayer.start}
        //             sequenceLength={sequenceLength}
        //             />
        //     );
        //     selectedLayer.push(
        //         <Caret 
        //             key='caretEnd'
        //             caretPosition={selectionLayer.end + 1}
        //             sequenceLength={sequenceLength}
        //             />
        //     );
        }
        // nothing selected, just put a caret at position 0
        if (caretPosition !== -1 && !selectionLayer.selected) {
            selectedStuff.push(
                <Caret 
                    charWidth = {charWidth}
                    row = {row}
                    sequenceLength = {sequenceLength}
                    caretPosition = {caretPosition}
                    />
            );
        }        
        
        return (
            <div className = {styles.rowItem + " veRowItem"}>
     
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
                        {...annotationCommonProps}
                        />
                }

                {(showCutsites && Object.keys(cutsites).length > 0) &&
                    <CutsiteLabels
                        annotationRanges={cutsites}
                        {...annotationCommonProps}
                        />
                }

                { selectedStuff }

                <div className='veRowItemSequenceContainer'>
                    <Sequence
                        reverse="false"
                        sequence={sequence}
                        charWidth={charWidth}
                        bpsPerRow={bpsPerRow}                        
                        >
                        {(showCutsites && Object.keys(cutsites).length > 0) && 
                            <Cutsites
                                sequenceLength={sequenceLength}
                                annotationRanges={cutsites}
                                topStrand={true}
                                {...annotationCommonProps}
                                />
                        }
                    </Sequence>

                    {showReverseSequence &&
                        <Sequence
                            reverse="true"
                            sequence={reverseSequence}
                            charWidth={charWidth}
                            bpsPerRow={bpsPerRow}
                            >                            
                            {(showCutsites && Object.keys(cutsites).length > 0) && 
                                <Cutsites
                                    sequenceLength={sequenceLength}
                                    annotationRanges={cutsites}
                                    topStrand={false}
                                    {...annotationCommonProps}
                                    />
                            }
                        </Sequence>
                    }
                </div>
        
            </div>
        );
    }
}

module.exports = RowItem;