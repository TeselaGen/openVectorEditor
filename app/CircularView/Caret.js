// import isNumber from 'lodash/lang/isNumber';
import getRangeAngles from 've-range-utils/getRangeAngles';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
export const draggableClassNames = ['selectionStart', 'selectionEnd', 'caretSvg'].reduce(function (obj, key) {
    obj[key] = key
    return obj
}, {});

export default function Caret ({caretPosition, sequenceLength, className, innerRadius, outerRadius}) {
    var {startAngle, endAngle} = getRangeAngles({start: caretPosition, end:caretPosition}, sequenceLength)
    
    // check for NaN or inf
    if(startAngle != startAngle || startAngle === Infinity) {
        startAngle = 0;
    }
    if(endAngle != endAngle || endAngle === Infinity) {
        endAngle = 0;
    } // do we want to use zero?

    return (
        <PositionAnnotationOnCircle
            key = 'caret'
            className = { className }
            sAngle = { startAngle }
            eAngle = { endAngle }
            height = { 0 }
            >
            <line
                className = { className }
                strokeWidth = '1px'
                style = {{ opacity: 9, zIndex: 100,  cursor: "ew-resize" }}
                x1 = { 0 }
                y1 = { -innerRadius }
                x2 = { 0 }
                y2 = { -outerRadius }
                stroke = "blue" 
                />
        </PositionAnnotationOnCircle>
    )
}