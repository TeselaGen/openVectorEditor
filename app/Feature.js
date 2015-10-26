import React from 'react';
import interpolate from 'interpolate';
import PureRenderMixin from 'react-addons-pure-render-mixin';

var Feature = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        widthInBps: React.PropTypes.number.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        rangeType: React.PropTypes.string.isRequired,
        color: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        forward: React.PropTypes.bool.isRequired
    },

    render: function() {
        var {
            widthInBps, 
            charWidth,
            height,
            rangeType,
            forward,
            name
        } = this.props;

        var width = widthInBps * charWidth;
        var normalizedCharWidth = charWidth;
        if (charWidth < 15) { //allow the arrow width to adapt
            if (width > 15) {
                normalizedCharWidth = 15; //tnr: replace 15 here with a non-hardcoded number..
            } else {
                normalizedCharWidth = width;
            }
        }
        var widthMinusOne = width - normalizedCharWidth;
        var points;

        // starting from the top left of the feature
        if (rangeType === 'middle') {
            //draw a rectangle
            points = interpolate('0,0 {width},0 {width},{height} 0,{height} 0,0', {
                width: width,
                height: height
            });
        } else if (rangeType === 'middle') {
            //draw a rectangle
            points = interpolate('0,0 {width},0 {width},{height} 0,{height} 0,0', {
                width: width,
                height: height
            });
        } else {
            points = interpolate('0,0 {widthMinusOne},0 {width},{heightHalved} {widthMinusOne},{height} 0,{height} 0,0', {
                width: width,
                widthMinusOne: widthMinusOne,
                height: height,
                heightHalved: height / 2
            });
        }
        return (
            <g
            onClick={this.props.onClick}
            >
            <polyline
                transform={forward ? null : "translate("+width+",0) scale(-1,1) "}
                points={points}
                strokeWidth="1"
                stroke={this.props.color}
                fillOpacity={0.4}
                fill={this.props.color || 'orange'}>
            </polyline>
            
          </g>
        );
    }
});
// <text 
//                 transform={"translate("+width/2+",0)"}
//                 x="0"  
//                 y="13"
//                 style={{textAnchor: "middle"}}
//                 >
//                 {name}
//             </text>
export default Feature;