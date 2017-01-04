var Path = require('paths-js/path');

// this is used to draw the pointed arrow arc of a feature

function polarToSpecialCartesian(radius, angleInRadians) {
    //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
    return {
        x: radius * Math.cos(angleInRadians - Math.PI/2),
        y: radius * Math.sin(angleInRadians - Math.PI/2)
    };
}

// draws a directed piece of the pie with an arrowhead, starts at 0 angle
export default function drawDirectedPiePiece ({arrowheadLength=.25, radius, annotationHeight, totalAngle, forward}) {
    var tailHeight = annotationHeight;
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
    var arcLeftBottom;
    var arcRightBottom;
    var arcRightTop;
    var arcLeftTop;
    var largeArcFlag;
    var path;

    // the main points we need to draw the arrow and in the order we draw them in:
    // check which strand we're on 
    if(forward) { // to point is clockwise, strand is -
        arrowheadPoint = polarToSpecialCartesian(radius, totalAngle);
        arcLeftBottom = polarToSpecialCartesian(tailInnerRadius, totalAngle - arrowheadAngle)
        arcRightBottom = polarToSpecialCartesian(tailInnerRadius, 0)
        arcRightTop = polarToSpecialCartesian(tailOuterRadius, 0)
        arcLeftTop = polarToSpecialCartesian(tailOuterRadius, totalAngle - arrowheadAngle)

        largeArcFlag = arcAngle > Math.PI ? 1 : 0
        path = Path()
            .moveto(arrowheadPoint.x, arrowheadPoint.y)
            .lineto(arcLeftTop.x, arcLeftTop.y)
            .arc({rx: tailOuterRadius, ry: tailOuterRadius, xrot: 0, largeArcFlag, sweepFlag: 0, x: arcRightTop.x, y: arcRightTop.y})
            .lineto(arcRightBottom.x, arcRightBottom.y)
            .arc({rx: tailInnerRadius, ry: tailInnerRadius, xrot: 0, largeArcFlag, sweepFlag: 1, x: arcLeftBottom.x, y: arcLeftBottom.y})            
            .closepath();
    } else { // to point is counterclockwise, strand is +
        arrowheadPoint = polarToSpecialCartesian(radius, 0);
        arcLeftBottom = polarToSpecialCartesian(tailInnerRadius, arrowheadAngle)
        arcRightBottom = polarToSpecialCartesian(tailInnerRadius, totalAngle)
        arcRightTop = polarToSpecialCartesian(tailOuterRadius, totalAngle)
        arcLeftTop = polarToSpecialCartesian(tailOuterRadius, arrowheadAngle)

        largeArcFlag = arcAngle > Math.PI ? 1 : 0
        path = Path()
            .moveto(arrowheadPoint.x, arrowheadPoint.y)
            .lineto(arcLeftBottom.x, arcLeftBottom.y)
            .arc({rx: tailInnerRadius, ry: tailInnerRadius, xrot: 0, largeArcFlag, sweepFlag: 1, x: arcRightBottom.x, y: arcRightBottom.y})
            .lineto(arcRightTop.x, arcRightTop.y)
            .arc({rx: tailOuterRadius, ry: tailOuterRadius, xrot: 0, largeArcFlag, sweepFlag: 0, x: arcLeftTop.x, y: arcLeftTop.y})
            .closepath();
    }
    
    path.print()
    return path;
}

