import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
var Orf = React.createClass({
    mixins: [PureRenderMixin],
    
    propTypes: {
        width: React.PropTypes.number.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        rangeType: React.PropTypes.string.isRequired,
        color: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        forward: React.PropTypes.bool.isRequired,
        lineThickness: React.PropTypes.number
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
                strokeWidth="1"
                stroke={this.props.color}
                fillOpacity={0.9}
                fill={this.props.color || 'orange'}/>)
        } else if (rangeType === 'start') {
            arrowOrCircle = (<path 
                transform={`scale(${charWidth/64},${height/64})`}
                d= 'M0 16 L0 48 L16 64 L48 64 L64 48 L64 16 L48 0 L16 0 Z' 
                strokeWidth="1"
                stroke={this.props.color}
                fillOpacity={0.9}
                fill={this.props.color || 'orange'}/>)
        }
        return (
            <g
            onClick={this.props.onClick}
            >
            <g transform={forward ? null : `translate(${width},0) scale(-1,1)`}
                >
                <path
                    transform={(rangeType === 'start' ? `translate(${charWidth},0)` : '') + `scale(${(width - (rangeType === 'middle' ? 0 : charWidth))/64},${height/64})`}
                    d='M0 40 L64 40 L64 20 L0 20 Z'
                    strokeWidth="1"
                    stroke={this.props.color}
                    fillOpacity={0.9}
                    fill={this.props.color || 'orange'}>
                </path>
                {arrowOrCircle}
            </g>
            <text 
              x="0"  
              y="0"
              style={{textAnchor: "middle"}}
              >
              {this.props.letter}
            </text>
          </g>
        );
    }
});
module.exports = Orf;