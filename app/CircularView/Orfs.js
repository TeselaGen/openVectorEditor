import getRangeAngles from './getRangeAnglesSpecial';
import getYOffset from './getYOffset';
import intervalTree2 from 'interval-tree2';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import PlacePointOnCircle from './PlacePointOnCircle';
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
        var arrowHead = null;

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

        var codonIndices = [];
        var endNode;
        // we always need an end dot, figure out which end to put it on
        if (annotation.forward) {
            endNode =  (
                        <PlacePointOnCircle
                            radius={ annotationRadius - annotationHeight/2 }
                            key={ 'codon' + c + "_" + annotation.id }
                            bpNumber={ annotation.start }
                            totalBps = { sequenceLength } 
                            >
                            <circle r='1.5' fill={ orfColor } stroke="none"/>
                        </PlacePointOnCircle>
                )
        } else {
            endNode =  (
                        <PlacePointOnCircle
                            radius={ annotationRadius - annotationHeight/2 }
                            key={ "endNode_" + annotation.id }
                            bpNumber={ annotation.end }
                            totalBps = { sequenceLength } 
                            >
                            <circle r='1.5' fill={ orfColor } stroke="none"/>
                        </PlacePointOnCircle>
                )
        }
        codonIndices.push( endNode );

        // check for codon indices
        if (annotation.internalStartCodonIndices.length > 0) {
            var codons = annotation.internalStartCodonIndices;
            var node;

            for(var c = 0; c < codons.length; c++) {
                node = (
                        <PlacePointOnCircle
                            radius={ annotationRadius - annotationHeight/2 }
                            key={ 'codon' + c + "_" + annotation.id }
                            bpNumber={ codons[c] }
                            totalBps = { sequenceLength } 
                            >
                            <circle r='1.5' fill={ orfColor } stroke="none"/>
                        </PlacePointOnCircle>
                )
                codonIndices.push( node );
            }
        }

        path = drawArc({ radius: annotationRadius, height: annotationHeight, totalAngle});

        // put the arrow at the beginning or the end
        var arrowEnd = annotation.forward ? annotation.end : annotation.start;

        arrowHead = (      
                        <PlacePointOnCircle
                            radius = { annotationRadius - annotationHeight/2 }
                            key = { 'arrow' + c + "_" + annotation.id }
                            bpNumber = { arrowEnd }
                            totalBps = { sequenceLength } 
                            >
                            <path 
                                fill = { orfColor }
                                stroke = "none"
                                d = {`M 0 ${annotationHeight/2} L -9 ${annotationHeight/2+3} L -9 ${annotationHeight/2-3} Z`} 
                                />
                        </PlacePointOnCircle>
                    )

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
                        { arrowHead } 
                        <path
                            onClick={ function (e) {
                                e.stopPropagation()
                                signals.orfClicked({annotation: annotation}) 
                            }}
                            d={ path.print() }
                            fill="none"
                            stroke={ orfColor }
                            strokeWidth={ annotationHeight/2 }                        
                            />
                    </PositionAnnotationOnCircle>
                    { codonIndices }             
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

