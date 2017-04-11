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
            event.stopPropagation();
            signals.cutsiteClicked({ annotation: annotation });
        }
        // function onDoubleClick(event) {
        //     event.stopPropagation()
        //     signals.sidebarToggle({ sidebar: true, annotation: annotation, view: "circular" })
        // }
        if (!(annotation.downstreamTopSnip > -1)) {
            debugger; //we need this to be present
        }
        var { startAngle } = getRangeAngles({
                                start: annotation.downstreamTopSnip,
                                end: annotation.downstreamTopSnip},
                                sequenceLength);
        // check if it's a singleton enzyme
        var cutColor = 'black';
        if(annotation.numberOfCuts === 1) { // this should really go on the enzyme obj
            cutColor = 'red';
        }

        // add label info
        labels[index]={
            annotationCenterAngle: startAngle,
            annotationCenterRadius: radius,
            text: annotation.restrictionEnzyme.name,
            color: cutColor,
            className: 'veCutsiteLabel',
            id: index
        }

        svgGroup.push(
            <g
                id={index}
                key={'cutsite' + index}
                >
                <PositionAnnotationOnCircle
                    className='cutsiteDrawing'
                    sAngle={ startAngle }
                    eAngle={ startAngle }
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
