var React = require('react');
var drawDirectedPiePiece = require('./graphic-helpers/drawDirectedPiePiece.js');
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
          fill={ color } />
        )
}