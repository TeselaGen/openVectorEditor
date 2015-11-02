var Path = require('paths-js/path');
function polarToSpecialCartesian(radius, angleInRadians) {
    //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
    return {
        x: radius * Math.cos(angleInRadians - Math.PI/2),
        y: radius * Math.sin(angleInRadians - Math.PI/2)
    };
}

// draws a directed piece of the pie with an arrowhead, starts at 0 angle, only draws in one direction (use transforms to move it around the ) 
export default function drawDirectedPiePiece ({tailThickness=.6, arrowheadLength=1, radius, annotationHeight, totalAngle}) {
    var tailHeight = annotationHeight*tailThickness;
    
    var arrowheadOuterRadius = radius + annotationHeight / 2;
    var arrowheadInnerRadius = radius - annotationHeight / 2;
    var tailOuterRadius = radius + tailHeight / 2;
    var tailInnerRadius = radius - tailHeight / 2;
    
    // var arrowheadAngle = totalAngle / 2
    var arrowheadAngle = arrowheadLength / (Math.PI * 2)

    if (totalAngle < arrowheadAngle) {
        //set arrowhead length to the angle in radians length
        arrowheadAngle = totalAngle;
    } 
    var arcAngle = totalAngle - arrowheadAngle;

    //the main points we need to draw the arrow and in the order we draw them in:
    var arrowheadPoint = polarToSpecialCartesian(radius, 0);
    var arrowheadBottom = polarToSpecialCartesian(arrowheadInnerRadius, arrowheadAngle)
    var arcLeftBottom = polarToSpecialCartesian(tailInnerRadius, arrowheadAngle)
    var arcRightBottom = polarToSpecialCartesian(tailInnerRadius, totalAngle)
    var arcRightTop = polarToSpecialCartesian(tailOuterRadius, totalAngle)
    var arcLeftTop = polarToSpecialCartesian(tailOuterRadius, arrowheadAngle)
    var arrowheadTop = polarToSpecialCartesian(arrowheadOuterRadius, arrowheadAngle)
    
    var large_arc_flag = arcAngle > Math.PI ? 1 : 0
    var path = Path()
      .moveto(arrowheadPoint.x,arrowheadPoint.y)
      .lineto(arrowheadBottom.x,arrowheadBottom.y)
      .lineto(arcLeftBottom.x,arcLeftBottom.y)
      .arc({rx: tailInnerRadius, ry: tailInnerRadius, xrot: 0, large_arc_flag, sweep_flag: 1, x: arcRightBottom.x, y: arcRightBottom.y})
      .lineto(arcRightTop.x,arcRightTop.y)
      .arc({rx: tailOuterRadius, ry: tailOuterRadius, xrot: 0, large_arc_flag, sweep_flag: 0, x: arcLeftTop.x, y: arcLeftTop.y})
      .lineto(arrowheadTop.x,arrowheadTop.y)
      .closepath();
      path.print()
    return path;
}