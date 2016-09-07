/* structure of row object

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
    - translations []
*/

// import PassThrough from '../../utils/PassThrough'
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString'
import React from 'react';
import Draggable from 'react-draggable'
import { Decorator as Cerebral } from 'cerebral-view-react';
import { columnizeString, elementWidth, calculateRowLength } from '../utils';
// import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence'
// import LineageLines from './LineageLines'
// import _Axis from './Axis'
// import _Orfs from './Orfs'
// import _Translations from './Translations'
import _Features from './Features'
// import _CutsiteLabels from './CutsiteLabels'
// import _Cutsites from './Cutsites'
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

    // this is an awkward workaround for react stripping this attribute from the text node
    componentDidMount() {
        var rowWidth = this.refs.rowViewTextContainer.viewBox.baseVal.width;
        if(rowWidth && rowWidth > 0) {
            // this.refs.rowViewTextContainer.children[0].setAttribute("textLength", rowWidth);
            this.setState({ rowWidth: rowWidth });
        }
    }

    render() {
        var {
            charWidth,
            selectionLayer,
            searchLayers,
            sequenceData,
            cutsiteLabelSelectionLayer,
            annotationHeight,
            tickSpacing,
            showCutsites,
            showReverseSequence,
            sequenceHeight,
            spaceBetweenAnnotations,
            width,
            additionalSelectionLayers,
            caretPosition,
            sequenceLength,
            row,
            showFeatures,
            bpsPerRow,
            componentOverrides = {},
            className
        } = this.props;

        // var {
        //     renderedSequence,
        //     renderedComplement,
        //     renderedOffset
        // } = this.state;
        
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
        //     Orfs = _Orfs,
        //     Translations = _Translations,
            Features = _Features,
        //     CutsiteLabels = _CutsiteLabels,
        //     Cutsites = _Cutsites,
            // Caret = _Caret,
        } = componentOverrides

        var annotationCommonProps = {
            charWidth,
            bpsPerRow,
            sequenceLength,
            annotationHeight,
            spaceBetweenAnnotations,
            row
        }
        
        return (
            <div className = {styles.rowItem + " veRowItem"}>
     
                <div className={styles.margin}>

                </div>

                {(showFeatures && Object.keys(features).length > 0) &&
                    <Features
                        annotationRanges={features}
                        {...annotationCommonProps}
                        />
                }

                <div className='veRowItemSequenceContainer'>
                    <Sequence
                        reverse="false"
                        sequence={sequence}
                        charWidth={charWidth}
                        bpsPerRow={bpsPerRow}
                        >
                    </Sequence>

                    {showReverseSequence &&
                        <Sequence
                            reverse="true"
                            sequence={reverseSequence}
                            charWidth={charWidth}
                            bpsPerRow={bpsPerRow}
                            >
                        </Sequence>
                    }
                </div>              
            </div>
        );
    }
}

module.exports = RowItem;