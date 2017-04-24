var React = require('react');
import drawDirectedPiePiece from '../drawDirectedPiePiece';
module.exports = function CircularPrimer({color='orange', radius,arrowheadLength=.5, annotationHeight, totalAngle, ...rest}) {
    var path = drawDirectedPiePiece({
        radius,
        annotationHeight,
        totalAngle,
        arrowheadLength,
        tailThickness:1 //feature specific
    })
    return (
        <path
            {...rest}
            className='vePrimer veCircularViewPrimer'
            strokeWidth=".5"
            stroke={ 'black' }
            fill={ color }
            d={ path.print() }
          />
        )
}
