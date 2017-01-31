// position annotation can only do arcs, this is a modified version to place things 
// like circles and triangles at the point they
// need to be on an arc based on the basepair number

var React = require('react');

function polarToSpecialCartesian(radius, angleInRadians) {
    //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
    return {
        x: radius * Math.cos(angleInRadians - Math.PI/2),
        y: radius * Math.sin(angleInRadians - Math.PI/2)
    };
}

export default function PlacePointOnCircle({children, radius=0, bpNumber=0, totalBps, forward, ...rest}) {
    // given radius and base pair find x and y
    // we need to flip the arrowheads and on the circles obviously it doesn't matter as they're cenetred at 0,0
    var angleOnCircle = bpNumber / totalBps * 2 * Math.PI; // angle in radians
    var coords = polarToSpecialCartesian(radius, angleOnCircle);
    if( forward ) {
        // transform wants degrees and not rads
        var transform = `translate(${ coords.x }, ${ coords.y }) rotate(${ angleOnCircle * 180 / Math.PI },0,0)`
    } else {
        var transform = `translate(${ coords.x }, ${ coords.y }) rotate(${ angleOnCircle * 180 / Math.PI + 180 },0,0)`
    }

    return (
        <g 
            transform={ transform }
            {...rest}
            >
            { children }
        </g>
    )
}