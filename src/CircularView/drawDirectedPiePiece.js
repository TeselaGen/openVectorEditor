import Path from "paths-js/path";
function polarToSpecialCartesian(radius, angleInRadians) {
  //the 0 angle returns the 0,1 point on the unit circle instead of the 1,0 point like normal
  return {
    x: radius * Math.cos(angleInRadians - Math.PI / 2),
    y: radius * Math.sin(angleInRadians - Math.PI / 2)
  };
}
const stickOutThisMuch = 0.03;

// draws a directed piece of the pie with an arrowhead, starts at 0 angle, only draws in one direction (use transforms to move it around the )
export default function drawDirectedPiePiece({
  tailThickness = 0.6,
  // arrowheadLength = 1,
  radius,
  arrowheadType,
  overlapsSelf,
  annotationHeight,
  totalAngle,
  hasLabel,
  labelNeedsFlip,
  returnTextPath
}) {
  const tailHeight = annotationHeight * tailThickness;

  const arrowheadOuterRadius = radius + annotationHeight / 2;
  const arrowheadInnerRadius = radius - annotationHeight / 2;
  const tailOuterRadius = radius + tailHeight / 2;
  const tailInnerRadius = radius - tailHeight / 2;

  // var arrowheadAngle = totalAngle / 2
  let arrowheadAngle = 80 / radius / (Math.PI * 2);

  if (totalAngle < arrowheadAngle) {
    //set arrowhead length to the angle in radians length
    arrowheadAngle = totalAngle;
  }

  if (arrowheadType === "NONE") arrowheadAngle = 0;
  const arcAngle = totalAngle - arrowheadAngle;

  //the main points we need to draw the arrow and in the order we draw them in:
  const arrowheadPoint = polarToSpecialCartesian(radius, 0);

  const arrowheadBottom = polarToSpecialCartesian(
    arrowheadInnerRadius,
    arrowheadAngle
  );
  const arcLeftBottom = polarToSpecialCartesian(
    tailInnerRadius,
    arrowheadAngle
  );
  const arcRightBottom = polarToSpecialCartesian(tailInnerRadius, totalAngle);
  const arcRightTop = polarToSpecialCartesian(tailOuterRadius, totalAngle);
  const arcRightMiddle = polarToSpecialCartesian(radius, totalAngle);
  const arcRightMiddleOuter = polarToSpecialCartesian(
    radius,
    totalAngle + stickOutThisMuch
  );
  const arcLeftTop = polarToSpecialCartesian(tailOuterRadius, arrowheadAngle);
  const arrowheadTop = polarToSpecialCartesian(
    arrowheadOuterRadius,
    arrowheadAngle
  );

  const largeArcFlag = arcAngle > Math.PI ? 1 : 0;
  let path = Path().moveto(arrowheadPoint.x, arrowheadPoint.y);

  if (overlapsSelf) {
    const arrowheadPointInner = polarToSpecialCartesian(
      radius,
      -stickOutThisMuch
    );
    path = path
      .lineto(arrowheadPointInner.x, arrowheadPointInner.y)
      .lineto(arrowheadPoint.x, arrowheadPoint.y);
  }

  path = path
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
    });

  if (overlapsSelf) {
    path = path
      .lineto(arcRightMiddle.x, arcRightMiddle.y)
      .lineto(arcRightMiddleOuter.x, arcRightMiddleOuter.y)
      .lineto(arcRightMiddle.x, arcRightMiddle.y);
  }
  let textPath;
  if (returnTextPath && hasLabel) {
    if (labelNeedsFlip) {
      const arcLeftTop = polarToSpecialCartesian(tailOuterRadius, 0);
      textPath = Path().moveto(arcRightTop.x, arcRightTop.y).arc({
        rx: tailOuterRadius,
        ry: tailOuterRadius,
        xrot: 0,
        largeArcFlag,
        sweepFlag: 0,
        x: arcLeftTop.x,
        y: arcLeftTop.y
      });
    } else {
      const arcLeftBottom = polarToSpecialCartesian(tailInnerRadius, 0);
      textPath = Path().moveto(arcLeftBottom.x, arcLeftBottom.y).arc({
        rx: tailInnerRadius,
        ry: tailInnerRadius,
        xrot: 0,
        largeArcFlag,
        sweepFlag: 1,
        x: arcRightBottom.x,
        y: arcRightBottom.y
      });
    }
  }
  path = path

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
  if (returnTextPath) {
    return [path, textPath];
  }
  return path;
}
