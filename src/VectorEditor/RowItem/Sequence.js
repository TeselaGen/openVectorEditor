import React, {
    PropTypes
}
from 'react';
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Sequence = React.createClass({
    mixins: [PureRenderMixin],
    render: function() {
        var {
            sequence, charWidth, containerStyle={}, children, length, height, className, startOffset=0
        } = this.props;
        var width = length * charWidth
        
        var style = {
            position: 'relative',
            height,
            ...containerStyle,
        }
        var textAttrs = {
            x:0,
            y: height,
            textLength: width,
            lengthAdjust: "spacing",
        }
        
        return (
            <div style={style} className='Sequence'>
                <svg style={{left: startOffset * charWidth, height, position: 'absolute'}} 
                    ref="rowViewTextContainer" 
                    className="rowViewTextContainer" width={width} height={height}>
                    <text className={'monospaceFont'} {...textAttrs}>
                            {sequence}
                        </text>
                    
                </svg>
                {children}
            </div>
        )

    }
});

module.exports = Sequence;
