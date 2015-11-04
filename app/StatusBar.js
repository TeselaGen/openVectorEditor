import React, { PropTypes } from 'react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies

import { Decorator as Cerebral } from 'cerebral-react';

var bsbStyle = {
    height: 20,
    background: 'none',
    display: 'flex',
    'flexDirection': 'row'
}
var itemStyle = {
    'marginRight': 10
}

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
        return (
            <div
              style={ bsbStyle }
              ref="BottomStatusBar">
              <div style={ itemStyle }>
                Length:
                { this.props.sequenceLength }
              </div>
              <div style={ itemStyle }>
                Melting Temp:
                { this.props.selectedSeqMeltingTemp }
              </div>
              <div style={ itemStyle }>
                Insert At:
                { this.props.caretPosition - 1 }
              </div>
              { this.props.selectionLayer.start !== -1 &&
                <div style={ itemStyle }>
                  Selecting:
                  { this.props.selectionLayer.start + 1 } :
                  { this.props.selectionLayer.end + 1 }
                </div> }
            </div>
            );
    }
}
