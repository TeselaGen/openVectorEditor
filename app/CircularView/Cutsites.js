import getRangeAngles from './getRangeAnglesSpecial';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
import each from 'lodash/collection/each';

export default function Cutsites({radius, cutsites, cutsiteHeight = 10, cutsiteWidth=.25, annotationHeight, sequenceLength, signals, bpsPerRow}) {
    var svgGroup = [];
    var labels = {};
    var index = 0;
    radius = radius;

    function singleClick(annotation) {
        var row = Math.floor((annotation.start-1)/(bpsPerRow));
        row = row <= 0 ? "0" : row;
        signals.jumpToRow({rowToJumpTo: row});
        signals.cutsiteClicked({ annotation: annotation });
    }

    function doubleClick(annotation) {
        var row = Math.floor((annotation.start-1)/(bpsPerRow));
        row = row <= 0 ? "0" : row;
        signals.jumpToRow({rowToJumpTo: row})
        signals.cutsiteClicked({ annotation: annotation });
        signals.sidebarToggle({ sidebar: true, annotation: annotation, view: "circular" });
        signals.adjustWidth();
    }

    each(cutsites,function(annotation, key) {
        index++;

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

        if (!(annotation.downstreamTopSnip > -1)) {
            debugger; //we need this to be present
        }
        var { startAngle } = getRangeAngles({
                                start: annotation.downstreamTopSnip,
                                end: annotation.downstreamTopSnip},
                                sequenceLength);

        // add label info
        labels[index]={
            annotationCenterAngle: startAngle,
            annotationCenterRadius: radius,
            text: annotation.restrictionEnzyme.name,
            color: annotation.color,
            className: 'veCutsiteLabel',
            id: index,
            handleClick,
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
