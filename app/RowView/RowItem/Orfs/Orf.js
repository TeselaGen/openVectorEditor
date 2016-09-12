import React, { PropTypes } from 'react';

var Orf = React.createClass({
    
    render() {
        var {
            height, 
            rangeType, 
            // normalizedInternalStartCodonIndices=[], 
            forward, 
            annotation, 
            width, 
            orfClicked,
            charWidth
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
                            `translate(${width - charWidth},0) 
                            scale(${charWidth/64},${height/64})`
                        }
                        d= {rangeType === 'start' 
                            ? 'M0 16 L0 48 L16 64 L48 64 L64 48 L64 16 L48 0 L16 0 Z' 
                            : 'M0 64 L64 32 L0 0 Z'} 
                        />)
        }
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
                        transform={(rangeType === 'start' ? 
                            `translate(${charWidth},0)` : '') 
                            + `scale(${(width - (rangeType === 'middle' 
                            ? 0 : charWidth))/64},${height/64})`}
                        d='M0 40 L64 40 L64 20 L0 20 Z'
                        >
                    </path>
                    { arrow }
                </g>
        );
    }
});
module.exports = Orf;
