import React, { PropTypes } from 'react';

var Orf = React.createClass({
    
    render() {
        var {
            height, 
            rangeType, 
            // normalizedInternalStartCodonIndices=[], 
            forward, 
            annotation, 
            widthInBps, 
            orfClicked,
            charWidth=16
        } = this.props;

        var frame = annotation.frame;
        // frame is one of [0,1,2] 
        // hacky fix for colors, not sure we're calculating reversed orfs right 
        var color = 'red';
        if (frame === 1) {
            color = 'green';
        } else if (frame === 2) {
            color = 'blue';
        }
        var width = widthInBps * (charWidth * 1.2) - 20;

        // var heightToUse = height/1.5;
        var arrow = null;
        // var endCircle = null;
        // var circle = <circle 
        //     key='circle'
        //     r={heightToUse/2}
        //     cx={heightToUse/2}
        //     cy={heightToUse/2}
        //     />
        if (rangeType === 'end'||rangeType === 'beginningAndEnd') {
            arrow = (<path 
                        transform={
                            `translate(${width - charWidth},0)`
                        }
                        d= {'M0 0 L16 8 L16 -8 Z'} 
                        />
                    )
        }

        var path = `
            M 0,0 
            L ${width},0 
            L ${width},${height}
            L 0,${height} 
            z`
        // if (rangeType === 'start'|| rangeType === 'beginningAndEnd') {
        //     endCircle = circle
        // }
        // var internalStartCodonCircles = normalizedInternalStartCodonIndices.map(function (internalStartCodon,index) {
        //   return React.cloneElement(circle, {key: index, transform: `translate(${charWidth * internalStartCodon},0)`})
        // })
        return (
                <g
                    onClick={function (event) {
                        orfClicked({annotation,event})
                    }}
                    className={`veRowViewOrf clickable frame${frame}`}
                    strokeWidth="2"
                    stroke={ color}
                    fill={ color } 
                    transform={forward ? null : `translate(${width},0) scale(-1,1)`}
                    >
                    
                    <path
                        d={ path }
                        >
                    </path>
                    { arrow }
                </g>
        );
    }
});
module.exports = Orf;
