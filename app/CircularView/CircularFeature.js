import React from 'react';
import drawDirectedPiePiece from './drawDirectedPiePiece';

module.exports = function CircularFeature({color, radius, annotationHeight, totalAngle, forward, onClick}) {

    var path = drawDirectedPiePiece({
        radius,
        annotationHeight,
        totalAngle,
        forward
    })

    return (
        <path
            onClick={onClick}
            d={ path.print() }
            fill={ color }
            />
    )
}
