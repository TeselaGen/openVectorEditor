import React, {
    PropTypes
}
from 'react';
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var SequenceContainer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        sequence: PropTypes.string.isRequired,
        charWidth: PropTypes.number.isRequired,
        children: PropTypes.any
    },
    render: function() {
        var {
            sequence, charWidth, children
        } = this.props;
        var style = {
        	position: 'relative'
        }
        var charWidth = this.props.charWidth;
        var textHTML = '<text font-family="Courier New, Courier, monospace" x="' + (charWidth / 4) + '" y="10" textLength="' + (charWidth * (sequence.length)) + '" length-adjust="spacing">' + sequence + '</text>';
        return (
            <div style={style} className='sequenceContainer'>
				<svg ref="textContainer" className="textContainer" width="100%" height={charWidth} dangerouslySetInnerHTML={{__html: textHTML}} />
				{children}
			</div>
        )

    }
});

module.exports = SequenceContainer;