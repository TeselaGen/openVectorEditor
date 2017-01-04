var Path = require('paths-js/path');

// This is used to draw the arc of an Orf

function polarToSpecialCartesian(radius, angleInRadians) {
    //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
    return {
        x: radius * Math.cos(angleInRadians - Math.PI/2),
        y: radius * Math.sin(angleInRadians - Math.PI/2)
    };
}

// draws a directed piece of the pie with an arrowhead, starts at 0 angle, only draws in one direction (use transforms to move it around the ) 
export default function drawArc ({radius, height, totalAngle}) {
    
    var innerRadius = radius - height / 2;

    //the main points we need to draw the arrow and in the order we draw them in:
    var arcStart = polarToSpecialCartesian(innerRadius, 0)
    var arcEnd = polarToSpecialCartesian(innerRadius, totalAngle)
    
    var largeArcFlag = totalAngle > Math.PI ? 1 : 0
    var path;

    path = Path()
        .moveto(arcStart.x, arcStart.y)
        .arc({rx: innerRadius, ry: innerRadius, xrot: 0, largeArcFlag, sweepFlag: 1, x: arcEnd.x, y: arcEnd.y})

    return path;
}