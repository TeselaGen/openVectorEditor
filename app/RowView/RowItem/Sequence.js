import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

@Cerebral({
    rowViewDimensions: ['rowViewDimensions'],
})

class Sequence extends React.Component {

    render() {
        var {
            bpsPerRow,
            children,
            className,
            reverse,
            sequence,
        } = this.props;

        var style = {
            position: 'relative',
            fontFamily: 'monospace',
            padding: '10px 20px 10px 25px',
            overflow: 'visible',
            letterSpacing: '11.2px',
            fontSize: '14pt',
            width: '100%',
            height: '20px'
        }

        var textColor = "#000"; // black
        if (reverse==="true") textColor = "#aaa"; // gray

        return (
            <div className='Sequence' id='sequenceText'>
                <svg style={style} ref="rowViewTextContainer" className="rowViewTextContainer"
                    >
                    <text ref="sequenceRow" fill={ textColor }>
                        { sequence }
                    </text>
                </svg>
                { children }
            </div>
        )
    }
}

module.exports = Sequence;
