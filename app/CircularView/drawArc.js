var Path = require('paths-js/path');

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
    // if (!flip) {
      path = Path()
        .moveto(arcStart.x, arcStart.y)
        .arc({rx: innerRadius, ry: innerRadius, xrot: 0, largeArcFlag, sweepFlag: 1, x: arcEnd.x, y: arcEnd.y})
        //console.log('path.print(): ' + JSON.stringify(path.print(),null,4));
    // } else {
    //   path = Path()
    //     .moveto(arcRightBottom.x,arcRightBottom.y)
    //     .arc({rx: tailInnerRadius, ry: tailInnerRadius, xrot: 0, largeArcFlag: largeArcFlag, sweepFlag: 0, x: arcLeftBottom.x, y: arcLeftBottom.y})
    //     //console.log('path.print(): ' + JSON.stringify(path.print(),null,4));
    // }
    return path;
}