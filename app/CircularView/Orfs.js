import getRangeAngles from './getRangeAnglesSpecial';
import getYOffset from './getYOffset';
import intervalTree2 from 'interval-tree2';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React from 'react';
import noop from 'lodash/utility/noop';
import drawArc from './drawArc.js';

export default function Orfs({radius, orfs=[], annotationHeight, spaceBetweenAnnotations=2, sequenceLength, signals}) {
    var totalAnnotationHeight = annotationHeight + spaceBetweenAnnotations;
    var orfITree = new intervalTree2(Math.PI);
    var maxYOffset = 0;
    var svgGroup = [];

    Object.keys(orfs).forEach(function(key, index) {
        var annotation = orfs[key]
        // an orf has {start, end, length, internalStartCodonIndices, frame, forward, id}
        var annotationCopy = {...annotation}
        var {startAngle, endAngle, totalAngle, centerAngle} = getRangeAngles(annotation, sequenceLength);
        var spansOrigin = startAngle > endAngle;
        var expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle;
        var annotationRadius;
        var yOffset1;
        var yOffset2;
        var path;

        console.log(annotation)

        // frame is one of [0,1,2] 
        // hacky fix for colors, not sure we're calculating reversed orfs right 
        var orfColor = 'red';
        if (annotationCopy.frame === 1) {
            orfColor = 'green';
        } else if (annotationCopy.frame === 2) {
            orfColor = 'blue';
        }

        if (spansOrigin) {
            annotationCopy.yOffset = getYOffset(orfITree, startAngle, expandedEndAngle)
        } else {
            //we need to check both locations to account for orfs that span the origin
            yOffset1 = getYOffset(orfITree, startAngle, expandedEndAngle)
            yOffset2 = getYOffset(orfITree, startAngle + Math.PI * 2, expandedEndAngle + Math.PI * 2)
            annotationCopy.yOffset = Math.max(yOffset1, yOffset2)
        }

        annotationRadius = radius + annotationCopy.yOffset*(annotationHeight + spaceBetweenAnnotations)

        if (spansOrigin) {
            orfITree.add(startAngle, expandedEndAngle, undefined, {...annotationCopy})
        } else {
            //normal orf
            // we need to add it twice to the interval tree to accomodate features which span the origin
            orfITree.add(startAngle, expandedEndAngle, undefined, {...annotationCopy})
            orfITree.add(startAngle + 2 * Math.PI, expandedEndAngle + 2 * Math.PI, undefined, {...annotationCopy})
        }

        if (annotationCopy.yOffset > maxYOffset) {
            maxYOffset = annotationCopy.yOffset;
        }

        path = drawArc({ radius: annotationRadius, height: annotationHeight, totalAngle});

        svgGroup.push(
            <g 
                id={annotation.id}
                key={'Orfs' + annotation.id}
                >
                <g className='Orfs clickable'>
                    <PositionAnnotationOnCircle
                        key={ 'orf' + annotation.id }
                        sAngle={ startAngle }
                        eAngle={ endAngle }
                        direction={ 'reverse' } // buh
                        >
                        <path
                            onClick={ function (e) {
                                e.stopPropagation()
                                signals.orfClicked({annotation: annotation}) 
                            }}
                            d={ path.print() }
                            fill="none"
                            stroke={ orfColor }
                            strokeWidth={ annotationHeight/2 }
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

