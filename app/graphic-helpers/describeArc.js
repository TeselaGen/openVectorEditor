var Path = require('paths-js/path');
function polarToCartesian(radius, angleInRadians) {
    return {
        x: radius * Math.cos(angleInRadians),
        y: radius * Math.sin(angleInRadians)
    };
}

// draws a directed piece of the pie with an arrowhead, starts at 0 angle, only draws in one direction (use transforms to move it around the ) 
export default function ({arrowheadOffset=.6, arrowheadLength=1, radius, annotationHeight, widthInBps, sequenceLength}) {
    var arcHeight = annotationHeight*arrowheadOffset;
    
    var arrowheadOuterRadius = radius + annotationHeight / 2;
    var arrowheadInnerRadius = radius - annotationHeight / 2;
    var arcOuterRadius = radius + arcHeight / 2;
    var arcInnerRadius = radius - arcHeight / 2;
    
    //angle for entire annotation
    var angleInRadians = (widthInBps/sequenceLength)*(Math.PI * 2);
    //angle for just the arrowhead
    // var arrowheadAngleInRadians = angleInRadians / 2
    var arrowheadAngleInRadians = arrowheadLength / (Math.PI * 2)

    if (angleInRadians < arrowheadAngleInRadians) {
        //set arrowhead length to the angle in radians length
        arrowheadAngleInRadians = angleInRadians;
    } 
    var arcAngle = angleInRadians - arrowheadAngleInRadians;

    //the main points we need to draw the arrow and in the order we draw them in:
    var arrowheadPoint = polarToCartesian(radius, 0);
    console.log('arrowheadPoint: ' + JSON.stringify(arrowheadPoint,null,4));
    var arrowheadBottom = polarToCartesian(arrowheadInnerRadius, arrowheadAngleInRadians)
    console.log('arrowheadBottom: ' + JSON.stringify(arrowheadBottom,null,4));
    
    var arcLeftBottom = polarToCartesian(arcInnerRadius, arrowheadAngleInRadians)
    console.log('arcLeftBottom: ' + JSON.stringify(arcLeftBottom,null,4));
    
    var arcRightBottom = polarToCartesian(arcInnerRadius, angleInRadians)
    console.log('arcRightBottom: ' + JSON.stringify(arcRightBottom,null,4));
    
    var arcRightTop = polarToCartesian(arcOuterRadius, angleInRadians)
    
    var arcLeftTop = polarToCartesian(arcOuterRadius, arrowheadAngleInRadians)
    
    var arrowheadTop = polarToCartesian(arrowheadOuterRadius, arrowheadAngleInRadians)
    
    var large_arc_flag = arcAngle > Math.PI ? 1 : 0
    var path = Path()
      .moveto(arrowheadPoint.x,arrowheadPoint.y)
      .lineto(arrowheadBottom.x,arrowheadBottom.y)
      .lineto(arcLeftBottom.x,arcLeftBottom.y)
      .arc({rx: arcInnerRadius, ry: arcInnerRadius, xrot: 0, large_arc_flag, sweep_flag: 1, x: arcRightBottom.x, y: arcRightBottom.y})
      .lineto(arcRightTop.x,arcRightTop.y)
      .arc({rx: arcOuterRadius, ry: arcOuterRadius, xrot: 0, large_arc_flag, sweep_flag: 0, x: arcLeftTop.x, y: arcLeftTop.y})
      .lineto(arrowheadTop.x,arrowheadTop.y)
      .closepath();
      path.print()
    return path;
}