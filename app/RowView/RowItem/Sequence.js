import React, {PropTypes} from 'react';

var Sequence = React.createClass({
    render() {
        var {
            sequence, 
            charWidth, 
            children, 
            length, 
            height, 
            className
        } = this.props;

        if (charWidth < 10) {
            return null;
        }
        var style = {
            position: 'relative',
            fontFamily: 'monospace'
        }
        
        return (
            <div style={style} className='Sequence'>
                <svg ref="rowViewTextContainer" className="rowViewTextContainer" width="100%" 
                    height="32px" style={{overflow: "visible"}}
                    >
                    <text style={{letterSpacing: ".2em"}}>
                        { sequence }
                    </text>
                </svg>
                { children }
            </div>
        )
    }
});

module.exports = Sequence;
