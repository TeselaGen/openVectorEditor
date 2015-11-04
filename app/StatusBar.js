import React, { PropTypes } from 'react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies

import { Decorator as Cerebral } from 'cerebral-react';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    selectedSeqMeltingTemp: ['selectedSeqMeltingTemp'],
    caretPosition: ['caretPosition'],
    selectionLayer: ['selectionLayer'],
})
@propTypes({
    sequenceLength: PropTypes.number.isRequired,
    selectedSeqMeltingTemp: PropTypes.number.isRequired,
    caretPosition: PropTypes.number.isRequired,
    selectionLayer: PropTypes.object.isRequired,
})
export default class StatusBar extends React.Component {

    render() {
        var {
            sequenceLength,
            selectedSeqMeltingTemp,
            caretPosition,
            selectionLayer
        } = this.props;

        var style = {
            bar: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end'
            },

            box: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            },

            label: {
                margin: '10px'
            },

            data: {
                margin: '10px 10px 10px 0'
            }
        };

        var selectionStart = (selectionLayer.start != -1) ? selectionLayer.start : '--';
        var selectionEnd = (selectionLayer.end != -1) ? selectionLayer.end : '--';

        return (
            <div ref="statusBar">
                <div style={style.bar}>
                    <div style={style.box}>
                        <div style={style.label}>Length</div>
                        <div style={style.data}>{sequenceLength}</div>
                    </div>

                    <div style={style.box}>
                        <div style={style.label}>Melting Temp.</div>
                        <div style={style.data}>{selectedSeqMeltingTemp}</div>
                    </div>

                    <div style={style.box}>
                        <div style={style.label}>Cursor</div>
                        <div style={style.data}>{caretPosition}</div>
                    </div>

                    <div style={style.box}>
                        <div style={style.label}>Selection</div>
                        <div style={style.data}>
                            {selectionStart} : {selectionEnd}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
