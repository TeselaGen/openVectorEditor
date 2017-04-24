import color from 'color';
import randomcolor from 'randomcolor'
import drawDirectedPiePiece from './drawDirectedPiePiece';
import getRangeAngles from './getRangeAnglesSpecial';
import lruMemoize from 'lru-memoize';
import PositionAnnotationOnCircle from './PositionAnnotationOnCircle';
import React from 'react';

function LineageLines(props ) {
    var {radius, HoverHelper, sequenceLength, lineageLines=[], annotationHeight} = props
    var lineageLinesToUse = lineageLines
    if (!Array.isArray(lineageLines)) {
      lineageLinesToUse = [lineageLines]
    }
    var height = 0
    var component = <g
      key='veLineageLines'
      className='veLineageLines'>
      {
        lineageLinesToUse.map(function (lineageLine, index) {
          if (!(lineageLine.start > -1 && lineageLine.end > -1 && sequenceLength > 0)) {
            return
          }
          height = annotationHeight
          var {startAngle, endAngle, totalAngle} = getRangeAngles(lineageLine, sequenceLength);
          var path = drawDirectedPiePiece({
              radius: radius + annotationHeight/2,
              annotationHeight,
              totalAngle,
              arrowheadLength: 0,
              tailThickness:1 //lineageLine specific
          })
          return <HoverHelper
          id={lineageLine.id}
          passJustOnMouseOverAndClassname
          key={ 'lineageLine' + index }
          >
          {function ({hovered}) {
            var colorToUse = hovered ? color(lineageLine.color).lighten(.1).hex() : lineageLine.color
            return <PositionAnnotationOnCircle
              sAngle={ startAngle }
              eAngle={ endAngle }
              forward>
                <path
                    className='veLineageLine'
                    strokeWidth={hovered ? 1.5 : 0}
                    stroke={ colorToUse }
                    fill={ colorToUse || randomcolor() }
                    d={ path.print() }
                  />
            </PositionAnnotationOnCircle>      
                    }}
            
          </HoverHelper>
        }).filter((el)=>el)
      }
    </g>
    return {
      component,
      height
    }
}

export default lruMemoize(5, undefined, true)(LineageLines)
