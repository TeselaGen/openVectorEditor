var React = require('react');
var AASliver = React.createClass({
    propTypes: {
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        color: React.PropTypes.string.isRequired,
        forward: React.PropTypes.bool.isRequired,
        positionInCodon: React.PropTypes.number.isRequired,
        letter: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired
    },
    render: function() {
        // return null
        var fatness = 24;
        var x1 = 50 - fatness;
        var x2 = 50 + fatness;
        // var shift = 0;
        // if (this.props.positionInCodon === 1) {
        //     shift = x2;
        // }
        // if (this.props.forward) {
        //   if (this.props.positionInCodon === 2) {
        //     shift = x2 * 2; 
        //   }
        // } else {
        //   if (this.props.positionInCodon === 0) {
        //     shift = x2 * 2; 
        //   }
        // }
        var offset = 0;
        var offsetStrength = 7;
        if (this.props.positionInCodon === 0) {
            offset = -1;
        } else if (this.props.positionInCodon === 2) {
            offset = 1;
        }
        if (!this.props.forward) {
            offset = -offset;
        }
        offset = offset * offsetStrength;
        return (
            <g
                onClick={this.props.onClick}
                transform={"scale(" + this.props.width/100 * 1.25 + ", "+ (this.props.height/100 ) + ") translate(" + (this.props.relativeAAPositionInRow*100 / 1.25 + offset) + ",0)" }
                >
                <polyline
                    transform={this.props.forward ? null : "translate(100,0) scale(-1,1) "}
                    points={"0,0 " + x2 + ",0 100,50 " + x2 + ",100 0,100 "+x1+",50 0,0"}
                    strokeWidth="5"
                    // stroke="black"
                    opacity={0.5}
                    fill={this.props.color || 'orange'}>
                </polyline>
                {this.props.positionInCodon === 1 &&
                <text 
                    transform="scale(3,3) translate(17,21)"
                    x="0"  
                    y="0"
                    style={{textAnchor: "middle"}}
                    >
                    {this.props.letter}
                </text>
                }
            </g>
        );
    }
});
module.exports = AASliver;