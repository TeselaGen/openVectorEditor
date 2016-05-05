import lruMemoize from 'lru-memoize';
import getAngleForPositionMidpoint from './getAngleForPositionMidpoint';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import shouldFlipText from './shouldFlipText';
import React, { PropTypes } from 'react';
import calculateTickMarkPositionsForGivenRange from '../utils/calculateTickMarkPositionsForGivenRange';
export const draggableClassNames = ['selectionStart', 'selectionEnd', 'caretSvg'].reduce(function (obj, key) {
    obj[key] = key
    return obj
}, {});

function Axis({radius, sequenceLength, circularAndLinearTickSpacing, tickMarkHeight = 10, tickMarkWidth=1, textOffset=20,axisLineThickness = 4} ) {
    //console.log('RENDERING AXIS');
    var tickPositions = calculateTickMarkPositionsForGivenRange({
        range: {
            start: 0,
            end: sequenceLength
        },
        tickSpacing: circularAndLinearTickSpacing,
        sequenceLength
    });

    var tickMarksAndLabels = tickPositions.map(function(tickPosition, index) {
        var tickAngle = getAngleForPositionMidpoint(tickPosition, sequenceLength);
        return (
            <PositionAnnotationOnCircle
              key={'axis' + index }
              sAngle={ tickAngle }
              eAngle={ tickAngle }
              height={ radius }>
              <text
                transform={ (shouldFlipText(tickAngle) ? 'rotate(180)' : '') + ` translate(0, ${shouldFlipText(tickAngle) ? -textOffset : textOffset})` }
                style={ {    textAnchor: "middle",    dominantBaseline: "central",    fontSize: 'small'} }>
                { tickPosition }
              </text>
              <rect
                width={ tickMarkWidth }
                height={ tickMarkHeight }>
              </rect>
            </PositionAnnotationOnCircle>
            )
    })
    var component = <g 
      key='veAxis'
      className='veAxis'>
      {tickMarksAndLabels}
      <circle
        key='circle'
        r={ radius }
        style={ {    fill: 'none',    stroke: 'black',    strokeWidth: 1} }>
      </circle>
    </g>
    return {
      component,
      height: textOffset + tickMarkHeight + axisLineThickness
    }
}

export default lruMemoize(5, undefined, true)(Axis)