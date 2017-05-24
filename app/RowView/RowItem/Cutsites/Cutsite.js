var React = require('react');
var interpolate = require('interpolate');

var Cutsite = React.createClass({

    render: function() {
        var {
            widthInBps,
            charWidth,
            height,
            rangeType,
            forward,
            name,
        } = this.props;

        var width = widthInBps * charWidth;
        var points;
        // starting from the top left of the Cutsite
        //draw a rectangle
        points = interpolate('0,0 {width},0 {width},{height} 0,{height} 0,0', {
            width: width,
            height: height
        });
        return (
            <g>
                <polyline
                    transform = { forward ? null : "translate(" + width + ",2.5) scale(-1,1) " } 
                    // TODO: this 2.5 shouldn't be hardcoded. 
                    // it is in there to make the annotation slightly smaller
                    points = { points }
                    strokeWidth = "1"
                    stroke = { this.props.color }
                    fillOpacity = { 0.4 }
                    fill = { this.props.color || 'orange' }
                    >
                </polyline>
                <text
                    transform = { "translate(" + width/2 + ",0)" }
                    x = "0"
                    y = "13"
                    style = {{ textAnchor : "middle" }}
                    >
                    { name }
                </text>
            </g>
        );
    }
});
module.exports = Cutsite;
