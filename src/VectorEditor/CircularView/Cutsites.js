/* @flow */
import getRangeAngles from './getRangeAnglesSpecial';
import lruMemoize from 'lru-memoize';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React from 'react';
import each from 'lodash/each';
function Cutsites({radius, HoverHelper, cutsiteClicked, cutsites, cutsiteWidth=1, annotationHeight=15, sequenceLength}) {
  radius += annotationHeight
  var svgGroup = []
  var labels = {}
  var index = 0
  each(cutsites,function(annotation, key) {
    index++
      function onClick(event) {
        cutsiteClicked({event, annotation})
        event.stopPropagation()
      }
      if (!(annotation.topSnipPosition > -1)) {
        debugger; //we need this to be present 
      }
      var {startAngle} = getRangeAngles({start: annotation.topSnipPosition, end: annotation.topSnipPosition}, sequenceLength);
      //expand the end angle if annotation spans the origin
      labels[annotation.id]={
          annotationCenterAngle: startAngle,
          annotationCenterRadius: radius,
          text: annotation.restrictionEnzyme.name,
          color: annotation.restrictionEnzyme.color,
          className: ' veCutsiteLabel',
          id: annotation.id,
          onClick,
      }
        if (!annotation.id) debugger;

      svgGroup.push(
        <HoverHelper
          id={annotation.id}
          key={'cutsite' + index}
          passJustOnMouseOverAndClassname
          >
          <PositionAnnotationOnCircle
            className='cutsiteDrawing'
            sAngle={startAngle}
            eAngle={startAngle}
            height={ radius }
            >
            <rect
              width={ cutsiteWidth }
              height={ annotationHeight }>
            </rect>
          </PositionAnnotationOnCircle>
        </HoverHelper>
        )
      
    })
  return {
    height: annotationHeight,
    labels,
    component: <g key={'cutsites'} className={'cutsites'}>
      {svgGroup}
    </g>}
}

export default lruMemoize(5, undefined, true)(Cutsites)
