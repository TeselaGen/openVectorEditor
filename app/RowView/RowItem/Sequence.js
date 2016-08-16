import React, {PropTypes} from 'react';
// var PureRenderMixin = require('react-addons-pure-render-mixin');

var Sequence = React.createClass({
    render: function() {
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
            position: 'relative'
        }
        
        return (
            <div style={style} className='Sequence'>
                <svg ref="rowViewTextContainer" className="rowViewTextContainer">
                    <text>
                        { sequence }
                    </text>
                </svg>
                { children }
            </div>
        )

    }
});

module.exports = Sequence;
