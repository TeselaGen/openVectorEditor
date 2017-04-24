import lruMemoize from 'lru-memoize';
import getAngleForPositionMidpoint from './getAngleForPositionMidpoint';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import shouldFlipText from './shouldFlipText';
import React from 'react';
import calculateTickMarkPositionsForGivenRange from '../utils/calculateTickMarkPositionsForGivenRange';

function Axis({radius, sequenceLength, showAxisNumbers, circularAndLinearTickSpacing, tickMarkHeight = 10, tickMarkWidth=1, textOffset=20,ringThickness = 6} ) {
    var height = ringThickness + (showAxisNumbers ? textOffset + tickMarkHeight : 0)
    // var radius = radius + height
    var tickPositions = calculateTickMarkPositionsForGivenRange({
        range: {
            start: 0,
            end: sequenceLength
        },
        tickSpacing: circularAndLinearTickSpacing,
        sequenceLength
    });

    var tickMarksAndLabels = showAxisNumbers
      ? tickPositions.map(function(tickPosition, index) {
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
                { tickPosition + 1 }
              </text>
              <rect
                width={ tickMarkWidth }
                height={ tickMarkHeight }>
              </rect>
            </PositionAnnotationOnCircle>
            )
      })
      : ''
    var component = <g
      key='veAxis'
      className='veAxis'>
      <circle
        className='veAxisFill'
        id='circularViewAxis'
        key='circleOuter'
        r={ (radius + ringThickness) }
        style={ {    fill: '#FFFFB3',    stroke: 'black', strokeWidth: .5} }>
      </circle>
      <circle
        id='circularViewAxis'
        key='circle'
        r={ radius }
        style={ {    fill: 'white',    stroke: 'black', strokeWidth: .5} }>
      </circle>
      {tickMarksAndLabels}
    </g>
    return {
      component,
      height
    }
}

export default lruMemoize(5, undefined, true)(Axis)
