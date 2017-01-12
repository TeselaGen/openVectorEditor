import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

var Orf = React.createClass({
    
    render() {
        var {
            height, 
            rangeType, 
            normalizedInternalStartCodonIndices=[], 
            forward, 
            annotation, 
            widthInBps, 
            orfClicked,
            charWidth=16,
            signals
        } = this.props;

        var frame = annotation.frame;
        // frame is one of [0,1,2] 
        var color = 'red';
        if (frame === 1) {
            color = 'green';
        } else if (frame === 2) {
            color = 'blue';
        }
        var width = widthInBps * (charWidth * 1.2) - 20;
        var heightWithArrow = height + 12;
        var halfwayPoint = heightWithArrow/2;
        var endCircle;
        var arrow = null;
        var circle = <circle 
                        key='circle'
                        r={height*1.5}
                        cx='0'
                        cy={halfwayPoint}
                        />
        if (rangeType === 'end'||rangeType === 'beginningAndEnd') {
            arrow = (<path 

                        transform={
                            `translate(${width + 20},0)`
                        }
                        d= {`M 0 ${halfwayPoint} L -18 ${halfwayPoint+6} L -18 ${halfwayPoint-6} Z`} 
                        />
                    )
        }
        if (rangeType === 'start'|| rangeType === 'beginningAndEnd') {
            endCircle = circle
        }        

        var path = `
            M 0,${halfwayPoint+height/2} 
            L ${width},${halfwayPoint+height/2} 
            L ${width},${halfwayPoint-height/2}
            L 0,${halfwayPoint-height/2} 
            z`

        var codonIndices = normalizedInternalStartCodonIndices.map(function (internalStartCodon,index) {
            return React.cloneElement(circle, {key: index, transform: `translate(${charWidth * 1.2 * internalStartCodon},0)`})
        })

        return (
            <g
                onClick={ function (e) {
                    e.stopPropagation()
                    signals.orfClicked({annotation: annotation}) 
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
                { codonIndices }
                { arrow }
                { endCircle }
            </g>
        );
    }
});
module.exports = Orf;
