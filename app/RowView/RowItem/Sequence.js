import React, {PropTypes} from 'react';

var Sequence = React.createClass({

    render() {
        var {
            bpsPerRow,
            charWidth, 
            children,            
            className,
            reverse,
            sequence            
        } = this.props;

        if (charWidth < 10) {
            return null;
        }
        var style = {
            position: 'relative',
            fontFamily: 'monospace',
            padding: '0 20px'
        }
        var rowWidth = bpsPerRow * charWidth * 1.2;
        var textColor = "#000"; // black
        if(reverse==="true") textColor = "#aaa"; // gray
        
        return (
            <div style={style} className='Sequence'>
                <svg ref="rowViewTextContainer" className="rowViewTextContainer" 
                    viewBox={ "0 " + charWidth*-0.85 + " " + rowWidth + " " + charWidth } // in future the radio should be bpsPerRow*charWidth x charHeight 
                    >
                    <text ref="sequenceRow" fill={ textColor } textLength={ rowWidth } lengthAdjust="spacing">
                        { sequence }
                    </text>
                </svg>
                { children }
            </div>
        )
    }
});

module.exports = Sequence;
