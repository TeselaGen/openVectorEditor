import getAnnotationNameAndStartStopString from '../utils/getAnnotationNameAndStartStopString';
import orfFrameToColorMap from '../constants/orfFrameToColorMap'
import drawDirectedPiePiece from './drawDirectedPiePiece'
import intervalTree2 from 'interval-tree2';
import getRangeAngles from './getRangeAnglesSpecial';
import getAngleForPositionMidpoint from './getAngleForPositionMidpoint'
import getYOffset from './getYOffset';
import lruMemoize from 'lru-memoize';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React from 'react';
import noop from 'lodash/noop';

function Orfs({radius, 
    //configurable
    spaceBetweenAnnotations=2, 
    orfHeight=6, 
    orfClicked=noop, 
    //non-configurable
    HoverHelper, 
    orfs={},
    sequenceLength,
    // annotationHeight
}) {
    // var orfHeight
    var totalAnnotationHeight = orfHeight + spaceBetweenAnnotations;
    var itree = new intervalTree2(Math.PI)
    var maxYOffset = 0
    var svgGroup = []
    var labels = {}
    
    
    Object.keys(orfs).forEach(function(key, index) {
        var annotation = orfs[key]
        function onClick (event) {
            orfClicked({event, annotation}) 
            event.stopPropagation()
        }
        var annotationCopy = {...annotation}
        
        var {startAngle, endAngle, totalAngle} = getRangeAngles(annotation, sequenceLength);
        
        var spansOrigin = startAngle > endAngle;
        //expand the end angle if annotation spans the origin
        var expandedEndAngle = spansOrigin ? endAngle + 2 * Math.PI : endAngle
        // if (annotationCopy.id === '5590c1d88979df000a4f02f5c') debugger;
        var yOffset1
        var yOffset2
        if (spansOrigin) {
            annotationCopy.yOffset = getYOffset(itree, startAngle, expandedEndAngle)
        } else {
            //we need to check both locations to account for annotations that span the origin
            yOffset1 = getYOffset(itree, startAngle, expandedEndAngle)
            yOffset2 = getYOffset(itree, startAngle + Math.PI * 2, expandedEndAngle + Math.PI * 2)
            annotationCopy.yOffset = Math.max(yOffset1, yOffset2)
        }

        if (spansOrigin) {
            itree.add(startAngle, expandedEndAngle, undefined, {...annotationCopy})
        } else {
            //normal orf
            // we need to add it twice to the interval tree to accomodate orfs which span the origin
            itree.add(startAngle, expandedEndAngle, undefined, {...annotationCopy})
            itree.add(startAngle + 2 * Math.PI, expandedEndAngle + 2 * Math.PI, undefined, {...annotationCopy})
        }

        if (annotationCopy.yOffset > maxYOffset) {
            maxYOffset = annotationCopy.yOffset;
        }
        var annotationRadius = radius + annotationCopy.yOffset*(totalAnnotationHeight)
        var path = drawDirectedPiePiece({
            radius: annotationRadius,
            annotationHeight: orfHeight,
            totalAngle,
            arrowheadLength: .4,
            tailThickness:.4 
        }).print()
        
        var color = orfFrameToColorMap[annotation.frame]
        svgGroup.push(
            <HoverHelper 
                id={annotation.id}
                key={'orf'+index}
                passJustOnMouseOverAndClassname
                >
                <g onClick={onClick} className='Orfs clickable'>
                    <title> {getAnnotationNameAndStartStopString(annotation, {startText: 'Open Reading Frame:'})} </title>
                    <PositionAnnotationOnCircle
                      sAngle={ startAngle }
                      eAngle={ endAngle }
                      forward={!annotation.forward}>
                      <path
                          className='veOrf'
                          strokeWidth=".5"
                          stroke={ color }
                          fill={ color }
                          d={ path }
                        />
                    </PositionAnnotationOnCircle>
                    {/*{
                      [annotation.forward ? annotation.start : annotation.end,...annotation.internalStartCodonIndices].map(function (position) {
                        var circleAngle = getAngleForPositionMidpoint(position, sequenceLength);
                        return <PositionAnnotationOnCircle
                          sAngle={ circleAngle }
                          eAngle={ circleAngle }
                          height={ annotationRadius }
                          forward={!annotation.forward}>
                          <circle
                              r={3}
                              strokeWidth=".5"
                              stroke={ color }
                              fill={ color }
                              d={ path }
                            />
                        </PositionAnnotationOnCircle>
                      })
                    }*/}
                </g>
            </HoverHelper>
        )
    })
    return {
        component: <g className='veOrfs' key='veOrfs'>
            {svgGroup}
        </g>,
        height: maxYOffset * totalAnnotationHeight + (.5 * orfHeight),
        labels
    }
}

export default lruMemoize(5,undefined,true)(Orfs)
