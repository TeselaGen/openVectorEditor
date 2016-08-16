// import PassThrough from '../../utils/PassThrough'
import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString'
import React from 'react';
import Draggable from 'react-draggable'
import { Decorator as Cerebral } from 'cerebral-view-react';
// import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence'
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

@Cerebral({
    annotationHeight: ['annotationHeight'],
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

export default class RowItem extends React.Component {
    render() {
        var {
            charWidth,
            selectionLayer,
            searchLayers,
            sequenceData,
            cutsiteLabelSelectionLayer,
            annotationHeight,
            tickSpacing,
            sequenceHeight,
            spaceBetweenAnnotations,
            width,
            additionalSelectionLayers,
            caretPosition,
            sequenceLength,
            row,
            bpsPerRow,
            componentOverrides = {}
        } = this.props;

        // var reverseSequence = getComplementSequenceString(sequence)
        // if (!row) {
        //     return null;
        // }

        var {
            Sequence = _Sequence,
        //     Axis = _Axis,
        //     Orfs = _Orfs,
        //     Translations = _Translations,
        //     Features = _Features,
        //     CutsiteLabels = _CutsiteLabels,
        //     Cutsites = _Cutsites,
        //     // Caret = _Caret,
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
                style={ rowContainerStyle }

                >
                <br></br>                



                 <div className='veRowItemSequenceContainer' style={{position: 'relative'}}>
                    <Sequence
                        sequence={sequenceData.sequence}
                        height={'12px'}
                        length={sequenceLength}
                        charWidth={charWidth}>

                    </Sequence>
                </div>
              
            </div>
        );
    }
}