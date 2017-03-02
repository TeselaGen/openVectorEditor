import getRangeAngles from './getRangeAnglesSpecial';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
import each from 'lodash/collection/each';

export default function Cutsites({radius, cutsites, cutsiteHeight = 10, cutsiteWidth=.25, annotationHeight, sequenceLength, signals}) {
    var svgGroup = [];
    var labels = {};
    var index = 0;
    radius = radius;
    each(cutsites,function(annotation, key) {
        index++;
        function onClick(event) {
            // cutsiteClicked({event, annotation, namespace})
            event.stopPropagation()
        }
        if (!(annotation.downstreamTopSnip > -1)) {
            debugger; //we need this to be present
        }
        var {startAngle} = getRangeAngles({start: annotation.downstreamTopSnip, end: annotation.downstreamTopSnip}, sequenceLength);

        // add label info
        labels[index]={
            annotationCenterAngle: startAngle,
            annotationCenterRadius: radius,
            text: annotation.restrictionEnzyme.name,
            color: annotation.restrictionEnzyme.color,
            className: 'veCutsiteLabel',
            id: index,
            onClick,
        }

        svgGroup.push(
            <g
                id={index}
                key={'cutsite' + index}
                >
                <PositionAnnotationOnCircle
                    className='cutsiteDrawing'
                    sAngle={startAngle}
                    eAngle={startAngle}
                    height={ radius }
                    >
                    <rect
                        width={ cutsiteWidth }
                        height={ cutsiteHeight }>
                    </rect>
                </PositionAnnotationOnCircle>
            </g>
        )

    })
    return {
        height: annotationHeight,
        labels,
        component: <g key={'cutsites'} className={'cutsites'}>
                    { svgGroup }
                    </g>
    }
}
