/* @flow */
import HoverHelper from '../HoverHelper';
import getRangeAngles from './getRangeAnglesSpecial';
import lruMemoize from 'lru-memoize';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React, { PropTypes } from 'react';
import each from 'lodash/each';
function Cutsites({radius, namespace, cutsiteClicked, cutsites, cutsiteHeight = 20, cutsiteWidth=2, annotationHeight, sequenceLength}) {
  //console.log('RENDERING CUTSITES');
  var svgGroup = []
  var labels = {}
  var index = 0
  each(cutsites,function(annotation, key) {
    index++
      function onClick(event) {
        cutsiteClicked({event, annotation, namespace})
        event.stopPropagation()
      }
      if (!(annotation.downstreamTopSnip > -1)) {
        debugger; //we need this to be present 
      }
      var {startAngle} = getRangeAngles({start: annotation.downstreamTopSnip, end: annotation.downstreamTopSnip}, sequenceLength);
      // //console.log('startAngle: ' + JSON.stringify(toDegrees(startAngle),null,4));
      // //console.log('endAngle: ' + JSON.stringify(toDegrees(endAngle),null,4));
      // //console.log('spansOrigin: ' + JSON.stringify(spansOrigin,null,4));
      //expand the end angle if annotation spans the origin
      labels[annotation.id]={
          annotationCenterAngle: startAngle,
          annotationCenterRadius: radius,
          text: annotation.restrictionEnzyme.name,
          color: annotation.restrictionEnzyme.color,
          className: 'veCutsiteLabel',
          id: annotation.id,
          onClick,
      }
        if (!annotation.id) debugger;

      // //console.log('labelCenter: ' + JSON.stringify(labelCenter,null,4));
      // //console.log('shouldFlipText(labelCenter): ' + JSON.stringify(shouldFlipText(labelCenter),null,4));
      svgGroup.push(
        <HoverHelper
          namespace={namespace}
          id={annotation.id}
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

