import getRangeAngles from './getRangeAnglesSpecial';
import getYOffset from './getYOffset';
import intervalTree2 from 'interval-tree2';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import PlacePointOnCircle from './PlacePointOnCircle';
import React from 'react';
import noop from 'lodash/utility/noop';
import drawArc from './drawArc.js';

export default function Orfs({radius, orfs=[], annotationHeight, spaceBetweenAnnotations=2, sequenceLength, signals, bpsPerRow}) {
    annotationHeight = 2;
    var totalAnnotationHeight = annotationHeight + spaceBetweenAnnotations;
    var orfITree = new intervalTree2(Math.PI);
    var maxYOffset = 0;
    var svgGroup = [];

    function singleClick(annotation) {
        var row = Math.floor((annotation.start-1)/(bpsPerRow));
        row = row <= 0 ? "0" : row;
        signals.jumpToRow({rowToJumpTo: row});
        signals.featureClicked({ annotation: annotation });
    }

    function doubleClick(annotation) {
        var row = Math.floor((annotation.start-1)/(bpsPerRow));
        row = row <= 0 ? "0" : row;
        signals.jumpToRow({rowToJumpTo: row})
        signals.featureClicked({ annotation: annotation });
        signals.sidebarToggle({ sidebar: true, annotation: annotation, view: "circular" });
        signals.adjustWidth();
    }

    Object.keys(orfs).forEach(function(key, index) {
        var annotation = orfs[key]
        var annotationCopy = {...annotation}
        var {
            startAngle,
            endAngle,
            totalAngle,
            centerAngle
        } = getRangeAngles(annotation, sequenceLength);
        var spansOrigin = startAngle > endAngle;
        var expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle;
        var annotationRadius;
        var yOffset1 = null;
        var yOffset2 = null;
        var path = null;
        var arrowHead = null;

        // frame is one of [0,1,2]
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


        function handleClick(event) {
            var clicks = 0;
            var timeout;

            return function() {
                clicks += 1;
                if (clicks === 1) {
                    timeout = setTimeout(function() {
                        singleClick(annotation);
                        clicks = 0;
                    }, 250);

                } else {
                    clearTimeout(timeout);
                    doubleClick(annotation);
                    clicks = 0;
                }
            }
        }

        var codonIndices = [];
        var endNode;
        // we always need an end dot, figure out which end to put it on
        if (annotationCopy.forward) {
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
        // {{}} it'd be nice if you could hover or click to get the index
        // or display them in the sidebar
        if (annotation.internalStartCodonIndices.length > 0) {
            var codons = annotation.internalStartCodonIndices;
            var node;

            for(var c = 0; c < codons.length; c++) {
                node = ( // {{}} node names are confusing here
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
                            key = { 'arrow' + c + "_" + annotationCopy.id }
                            bpNumber = { arrowEnd }
                            totalBps = { sequenceLength }
                            forward = { annotationCopy.forward }
                            >
                            <path
                                fill = { orfColor }
                                stroke = "none"
                                // the arrowhead is contained in the orf,
                                // so the very tip of the arrow is the 0/end of the orf, no overhang
                                d = {`M 0 0 L -6 2 L -6 -2 Z`}
                                />
                        </PlacePointOnCircle>
                    )

        svgGroup.push(
            <g
                id={annotation.id}
                key={'Orfs' + annotation.id}
                onClick={handleClick()}
                >
                <g className='Orfs clickable'>
                    { arrowHead }
                    <PositionAnnotationOnCircle
                        key={ 'orf' + annotationCopy.id }
                        sAngle={ startAngle }
                        eAngle={ endAngle }
                        direction={ 'reverse' } // buh
                        >
                        <path
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
