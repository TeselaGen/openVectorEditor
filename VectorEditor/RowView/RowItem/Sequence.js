import React, {
    PropTypes
}
from 'react';
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Sequence = React.createClass({
    mixins: [PureRenderMixin],
    render: function() {
        var {
            sequence, charWidth, children, length, height
        } = this.props;
        if (charWidth < 10) {
            return null;
        }
        var style = {
            position: 'relative'
        }
        var textAttrs = {
            x:0,
            y: "10",
            fontFamily: "Consolas, Courier New, Courier, monospace",
            textLength: charWidth * length,
            lengthAdjust: "spacing",
        }
        
        return (
            <div style={style} className='Sequence'>
                <svg ref="textContainer" className="textContainer" width="100%" height={height}>
                    <text {...textAttrs}>
                        {sequence}
                    </text>
                </svg>
                {children}
            </div>
        )

    }
});

module.exports = Sequence;
