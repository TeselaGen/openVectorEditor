import React from 'react';
import drawDirectedPiePiece from './drawDirectedPiePiece';

module.exports = function CircularFeature({color, radius, annotationHeight, totalAngle, forward}) {

    var path = drawDirectedPiePiece({
        radius,
        annotationHeight,
        totalAngle,
        forward
    })

    return (
        <path
            d={ path.print() }
            fill={ color } 
            />
    )
}