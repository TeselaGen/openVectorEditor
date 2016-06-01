import React from 'react';
import drawDirectedPiePiece from './drawDirectedPiePiece';

module.exports = function CircularFeature({color, radius, annotationHeight, totalAngle}) {
    var path = drawDirectedPiePiece({
        radius,
        annotationHeight,
        totalAngle,
        tailThickness:1 //feature specific
    })

    return (
        <path
            d={ path.print() }
            fill={ color } 
            />
    )
}