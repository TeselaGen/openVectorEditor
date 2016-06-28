import getRangeAngles from './getRangeAnglesSpecial';
import getYOffset from './getYOffset';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React from 'react';
import noop from 'lodash/utility/noop';
import drawArc from './drawArc.js';

export default function Orfs({radius, orfs=[], annotationHeight, spaceBetweenAnnotations=2, sequenceLength, signals}) {
    //console.log('RENDERING FEATURES');
    var totalAnnotationHeight = annotationHeight + spaceBetweenAnnotations;
    var maxYOffset = 0
    var svgGroup = []

    Object.keys(orfs).forEach(function(key, index) {
        var annotation = orfs[key]
        // an orf has {start, end, length, internalStartCodonIndices, frame, forward, id}
        var annotationCopy = {...annotation}
        var {startAngle, endAngle, totalAngle, centerAngle} = getRangeAngles(annotation, sequenceLength);
        var spansOrigin = startAngle > endAngle;
        var expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle

        var orfColor = 'red';
        var path = drawArc({radius, height: annotationHeight, totalAngle});
        if (annotation.frame === 2) {
            orfColor = 'green';
        } else if (annotation.frame === 3) {
            orfColor = 'blue';
        }

        svgGroup.push(
            <g 
                id={annotation.id}
                key={'Orfs' + annotation.id}
                >
                <defs>
                    <g id='codon'>
                        <circle style={{fill:'inherit'}} r="2"/>
                    </g>
                    <marker id='arrow'>
                        <path 
                            d="M 200 50 L 300 150 L 200 150 L 200 50" 
                            stroke="red" 
                            strokeWidth="3" 
                            fill="none"  
                            />
                    </marker>
                </defs>
                <g className='Orfs clickable'>
                    <PositionAnnotationOnCircle
                        key={ 'orf' + annotation.id }
                        sAngle={ startAngle }
                        eAngle={ endAngle }
                        direction={ 'reverse' } // buh
                        >
                        <path
                            d={ path.print() }
                            fill="none"
                            stroke={ orfColor }
                            strokeWidth={ annotationHeight }
                            markerEnd="url(#arrow)"
                            />

                    </PositionAnnotationOnCircle>                   
                </g>
            </g>
        )
    })
    return {
        component: <g className='veOrfs' key='veOrfs'>
            { svgGroup }
        </g>,
        height: (maxYOffset + 1) * totalAnnotationHeight,
    }
}

