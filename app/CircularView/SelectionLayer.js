import Caret from './Caret';
import sector from 'paths-js/sector';
import getRangeAngles from './getRangeAnglesSpecial';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
export const draggableClassNames = ['selectionStart', 'selectionEnd', 'caretSvg'].reduce(function (obj, key) {
    obj[key] = key
    return obj
}, {});

export default function SelectionLayer ({selectionLayer, sequenceLength, radius, innerRadius}) {
    var {startAngle, endAngle, totalAngle} = getRangeAngles(selectionLayer, sequenceLength)

    var section = sector({
        center: [0, 0], //the center is always 0,0 for our annotations :) we rotate later!
        r: innerRadius,
        R: radius,
        start: 0,
        end: totalAngle
    });

    var section2 = sector({
        center: [0, 0], //the center is always 0,0 for our annotations :) we rotate later!
        r: innerRadius,
        R: radius,
        start: 0,
        end: Math.PI * 2 - totalAngle
    });

    return (
        <g key='veSelectionLayer' className='veSelectionLayer'>
            <PositionAnnotationOnCircle
                className='selectionLayerWrapper'
                sAngle={ startAngle }
                eAngle={ endAngle }
                height={ 0 }
                >
                <path
                    className='selectionLayer'
                    style={{ opacity: .4 }}
                    d={ section.path.print() }
                    fill="blue" 
                    />
            </PositionAnnotationOnCircle>
            <PositionAnnotationOnCircle
                className='selectionLayerInverseWrapper'
                sAngle={ endAngle }
                eAngle={ startAngle }
                height={ 0 }
                >
                <path
                    className='selectionLayerInverse'
                    style={{ opacity: .2 }}
                    d={ section2.path.print() }
                    fill="red" 
                    />
            </PositionAnnotationOnCircle>
            <Caret 
                className={ 'selectionLayerCaret ' + draggableClassNames.selectionStart}
                caretPosition={selectionLayer.start}
                sequenceLength={sequenceLength}
                innerRadius={innerRadius}
                outerRadius={radius}
                />
            <Caret 
                className={ 'selectionLayerCaret ' + draggableClassNames.selectionEnd}
                caretPosition={selectionLayer.end + 1}
                sequenceLength={sequenceLength}
                innerRadius={innerRadius}
                outerRadius={radius}
                />
        </g>
    )
}