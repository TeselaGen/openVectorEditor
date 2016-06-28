var Path = require('paths-js/path');

function polarToSpecialCartesian(radius, angleInRadians) {
    //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
    return {
        x: radius * Math.cos(angleInRadians - Math.PI/2),
        y: radius * Math.sin(angleInRadians - Math.PI/2)
    };
}

// draws a directed piece of the pie with an arrowhead, starts at 0 angle
export default function drawDirectedPiePiece ({arrowheadLength=.5, radius, annotationHeight, totalAngle, forward}) {
    var tailHeight = annotationHeight;

    console.log(forward);
    
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

    var arrowheadPoint;
    var arrowheadBottom;
    var arcLeftBottom;
    var arcRightBottom;
    var arcRightTop;
    var arcLeftTop;
    var arrowheadTop;

    // the main points we need to draw the arrow and in the order we draw them in:
    // check which strand we're on 
    if(forward) {
        arrowheadPoint = polarToSpecialCartesian(radius, 0);
        arrowheadBottom = polarToSpecialCartesian(arrowheadInnerRadius, arrowheadAngle)
        arcLeftBottom = polarToSpecialCartesian(tailInnerRadius, arrowheadAngle)
        arcRightBottom = polarToSpecialCartesian(tailInnerRadius, totalAngle)
        arcRightTop = polarToSpecialCartesian(tailOuterRadius, totalAngle)
        arcLeftTop = polarToSpecialCartesian(tailOuterRadius, arrowheadAngle)
        arrowheadTop = polarToSpecialCartesian(arrowheadOuterRadius, arrowheadAngle)
    } else {
        arrowheadPoint = polarToSpecialCartesian(radius, 0);
        arrowheadBottom = polarToSpecialCartesian(arrowheadInnerRadius, arrowheadAngle)
        arcLeftBottom = polarToSpecialCartesian(tailInnerRadius, arrowheadAngle)
        arcRightBottom = polarToSpecialCartesian(tailInnerRadius, totalAngle)
        arcRightTop = polarToSpecialCartesian(tailOuterRadius, totalAngle)
        arcLeftTop = polarToSpecialCartesian(tailOuterRadius, arrowheadAngle)
        arrowheadTop = polarToSpecialCartesian(arrowheadOuterRadius, arrowheadAngle)
    }
    
    var largeArcFlag = arcAngle > Math.PI ? 1 : 0
    var path = Path()
        .moveto(arrowheadPoint.x, arrowheadPoint.y)
        .lineto(arrowheadBottom.x, arrowheadBottom.y)
        .lineto(arcLeftBottom.x, arcLeftBottom.y)
        .arc({rx: tailInnerRadius, ry: tailInnerRadius, xrot: 0, largeArcFlag, sweepFlag: 1, x: arcRightBottom.x, y: arcRightBottom.y})
        .lineto(arcRightTop.x, arcRightTop.y)
        .arc({rx: tailOuterRadius, ry: tailOuterRadius, xrot: 0, largeArcFlag, sweepFlag: 0, x: arcLeftTop.x, y: arcLeftTop.y})
        .lineto(arrowheadTop.x, arrowheadTop.y)
        .closepath();
    path.print()
    return path;
}

