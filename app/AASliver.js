import React, {PropTypes} from 'react';
let PureRenderMixin = require('react-addons-pure-render-mixin');
let AASliver = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
        forward: PropTypes.bool.isRequired,
        positionInCodon: PropTypes.number.isRequired,
        letter: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        onDoubleClick: PropTypes.func.isRequired,
        relativeAAPositionInTranslation: PropTypes.number.isRequired
    },
    render() {
        let fatness = 24;
        let x1 = 50 - fatness;
        let x2 = 50 + fatness;
        let offset = 0;
        let offsetStrength = 7;
        if (this.props.positionInCodon === 0) {
            offset = -1;
        } else if (this.props.positionInCodon === 2) {
            offset = 1;
        }
        if (this.props.forward) {
            offset = -offset;
        }
        offset = offset * offsetStrength;
        if (this.props.letter === '-') {
            return null;
        }
        return (
            <g
                onClick={getClickHandler(this.props.onClick, this.props.onDoubleClick, 250)}
                onDoubleClick={this.props.onDoubleClick}
                transform={"scale(" + this.props.width / 100 * 1.25 + ", " + (this.props.height / 100 ) + ") translate(" + (this.props.relativeAAPositionInTranslation * 100 / 1.25 + offset) + ",0)" }
                >
                <polyline
                    transform={this.props.forward ? null : "translate(100,0) scale(-1,1) "}
                    points={"0,0 " + x2 + ",0 100,50 " + x2 + ",100 0,100 " + x1 + ",50 0,0"}
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
        function getClickHandler(onClick, onDblClick, pDelay) {
            let timeoutID = null;
            const delay = pDelay || 250;
            return function(event) {
                let singleClicking = true;
                if (!timeoutID) {
                    timeoutID = setTimeout(function() {
                        if (singleClicking) {
                            onClick(event);
                        }
                        timeoutID = null;
                    }, delay);
                } else {
                    singleClicking = false;
                    timeoutID = clearTimeout(timeoutID);
                    onDblClick(event);
                }
            };
        }
    }
});
module.exports = AASliver;