import Path from "paths-js/path";
function polarToSpecialCartesian(radius, angleInRadians) {
  //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
  return {
    x: radius * Math.cos(angleInRadians - Math.PI / 2),
    y: radius * Math.sin(angleInRadians - Math.PI / 2)
  };
}

// draws a directed piece of the pie with an arrowhead, starts at 0 angle, only draws in one direction (use transforms to move it around the )
export default function drawDirectedPiePiece({
  tailThickness = 0.6,
  arrowheadLength = 1,
  radius,
  annotationHeight,
  totalAngle
}) {
  let tailHeight = annotationHeight * tailThickness;

  let arrowheadOuterRadius = radius + annotationHeight / 2;
  let arrowheadInnerRadius = radius - annotationHeight / 2;
  let tailOuterRadius = radius + tailHeight / 2;
  let tailInnerRadius = radius - tailHeight / 2;

  // var arrowheadAngle = totalAngle / 2
  let arrowheadAngle = arrowheadLength / (Math.PI * 2);

  if (totalAngle < arrowheadAngle) {
    //set arrowhead length to the angle in radians length
    arrowheadAngle = totalAngle;
  }
  let arcAngle = totalAngle - arrowheadAngle;

  //the main points we need to draw the arrow and in the order we draw them in:
  let arrowheadPoint = polarToSpecialCartesian(radius, 0);
  let arrowheadBottom = polarToSpecialCartesian(
    arrowheadInnerRadius,
    arrowheadAngle
  );
  let arcLeftBottom = polarToSpecialCartesian(tailInnerRadius, arrowheadAngle);
  let arcRightBottom = polarToSpecialCartesian(tailInnerRadius, totalAngle);
  let arcRightTop = polarToSpecialCartesian(tailOuterRadius, totalAngle);
  let arcLeftTop = polarToSpecialCartesian(tailOuterRadius, arrowheadAngle);
  let arrowheadTop = polarToSpecialCartesian(
    arrowheadOuterRadius,
    arrowheadAngle
  );

  let largeArcFlag = arcAngle > Math.PI ? 1 : 0;
  let path = Path()
    .moveto(arrowheadPoint.x, arrowheadPoint.y)
    .lineto(arrowheadBottom.x, arrowheadBottom.y)
    .lineto(arcLeftBottom.x, arcLeftBottom.y)
    .arc({
      rx: tailInnerRadius,
      ry: tailInnerRadius,
      xrot: 0,
      largeArcFlag,
      sweepFlag: 1,
      x: arcRightBottom.x,
      y: arcRightBottom.y
    })
    .lineto(arcRightTop.x, arcRightTop.y)
    .arc({
      rx: tailOuterRadius,
      ry: tailOuterRadius,
      xrot: 0,
      largeArcFlag,
      sweepFlag: 0,
      x: arcLeftTop.x,
      y: arcLeftTop.y
    })
    .lineto(arrowheadTop.x, arrowheadTop.y)
    .closepath();
  path.print();
  return path;
}
