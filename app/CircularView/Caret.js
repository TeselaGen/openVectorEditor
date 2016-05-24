import isNumber from 'lodash/isNumber';
import getRangeAngles from 've-range-utils/getRangeAngles';
import lruMemoize from 'lru-memoize';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
export const draggableClassNames = ['selectionStart', 'selectionEnd', 'caretSvg'].reduce(function (obj, key) {
    obj[key] = key
    return obj
}, {});

function Caret ({caretPosition, sequenceLength, className, innerRadius, outerRadius}) {
    var {startAngle, endAngle} = getRangeAngles({start: caretPosition, end:caretPosition}, sequenceLength)
    if (!isNumber(startAngle)) {
        console.error("we've got a problem!")
    }
    return (
        <PositionAnnotationOnCircle
          key='caret'
          className={className}
          sAngle={ startAngle }
          eAngle={ endAngle }
          height={ 0 }>
          <line
            className={className}
            strokeWidth='2px'
            style={ { opacity: 9, zIndex: 100,  cursor: "ew-resize",} }//tnr: the classname needs to be cursor here!
            x1={0}
            y1={-innerRadius}
            x2={0}
            y2={-outerRadius}
            stroke="blue" />
        </PositionAnnotationOnCircle>
    )
}

export default lruMemoize(5, undefined, true)(Caret)