import React, { PropTypes } from 'react';

let PureRenderMixin = require('react-addons-pure-render-mixin');
var Orf = React.createClass({
    mixins: [PureRenderMixin],
    
    propTypes: {
        width: PropTypes.number.isRequired,
        charWidth: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        rangeType: PropTypes.string.isRequired,
        forward: PropTypes.bool.isRequired,
    },

    render() {
        var {height, rangeType, forward, width, charWidth} = this.props;
        var arrowOrCircle = null;
        if (rangeType === 'end') {
            arrowOrCircle = (<path 
                transform={`translate(${width - charWidth},0) scale(${charWidth/64},${height/64})`}
                d= {rangeType === 'start' 
                    ? 'M0 16 L0 48 L16 64 L48 64 L64 48 L64 16 L48 0 L16 0 Z' 
                    : 'M0 64 L64 32 L0 0 Z'} 
                />)
        } else if (rangeType === 'start') {
            arrowOrCircle = (<path 
                transform={`scale(${charWidth/64},${height/64})`}
                d= 'M0 16 L0 48 L16 64 L48 64 L64 48 L64 16 L48 0 L16 0 Z' 
                />)
        }
        return (
                <g transform={forward ? null : `translate(${width},0) scale(-1,1)`}
                    >
                    <path
                        transform={(rangeType === 'start' ? `translate(${charWidth},0)` : '') + `scale(${(width - (rangeType === 'middle' ? 0 : charWidth))/64},${height/64})`}
                        d='M0 40 L64 40 L64 20 L0 20 Z'
                        >
                    </path>
                    {arrowOrCircle}
                </g>
        );
    }
});
module.exports = Orf;