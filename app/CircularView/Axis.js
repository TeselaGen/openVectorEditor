/*
    The axis for our purposes is essentially the pale yellow tire that sits in the circularView
    annotations and such are arranged around this circle but we're doing away with the tick marks 
    and numbers used in the TG version
*/

import getAngleForPositionMidpoint from './getAngleForPositionMidpoint';
import React, { PropTypes } from 'react';
export const draggableClassNames = ['selectionStart', 'selectionEnd', 'caretSvg'].reduce(function (obj, key) {
    obj[key] = key;
    return obj;
}, {});

export default function Axis({radius, innerRadius, sequenceLength, axisLineThickness = 12} ) {

    var component = 
        <g 
          key='veAxis'
          className='veAxis'>
            <path
                d={`M 0, 0 m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius*2},0 a ${radius},${radius} 0 1,0 -${radius*2},0 ` +
                    `M 0, 0 m -${innerRadius}, 0 a ${innerRadius},${innerRadius} 0 1,1 ${innerRadius*2},0 a ${innerRadius},${innerRadius} 0 1,1 -${innerRadius*2},0`}
                fill={'#ffff99'}
                stroke={'black'}
                strokeWidth={'.25px'}
                />
        </g>
    return {
        component,
        height: axisLineThickness
    }
}