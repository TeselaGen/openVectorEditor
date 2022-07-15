import Color from "color";
import { startsWith } from "lodash";
import React from "react";

import drawDirectedPiePiece from "./drawDirectedPiePiece";
import shouldFlipText from "./shouldFlipText";

export default function Feature({
  color = "orange",
  radius,
  containsLocations,
  arrowheadLength = 0.5,
  annotationHeight,
  className,
  ellipsizedName,
  annotationType,
  id,
  angleAdjust,
  overlapsSelf,
  rotationRadians,
  revTransform,
  centerAngle,
  totalAngle
}) {
  const isPart = annotationType === "part";
  let colorToUse = color;
  if (isPart) {
    colorToUse = startsWith(color, "override_")
      ? color.replace("override_", "")
      : "purple";
  }
  const labelNeedsFlip = shouldFlipText(centerAngle + rotationRadians);
  if (containsLocations) {
    const path = drawDirectedPiePiece({
      radius: radius,
      labelNeedsFlip,
      annotationHeight: annotationHeight / 8,
      totalAngle,
      arrowheadLength: 80 / radius,
      tailThickness: 1 //feature specific
    });
    return (
      <path
        className={className}
        strokeWidth=".5"
        stroke="black"
        fill={colorToUse}
        d={path.print()}
      />
    );
  }
  const [path, textPath] = drawDirectedPiePiece({
    returnTextPath: true,
    overlapsSelf,
    hasLabel: ellipsizedName,
    labelNeedsFlip,
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });
  const pathId = `${annotationType}${id}`;
  return (
    <>
      <path
        className={className}
        strokeWidth=".5"
        stroke={isPart ? colorToUse : "black"}
        fill={isPart ? undefined : colorToUse}
        d={path.print()}
      />
      {ellipsizedName && (
        <>
          <path id={pathId} fill="none" d={textPath.print()}></path>
          <text
            className="veLabelText ve-monospace-font"
            // transform={revTransform}
            transform={
              (revTransform || "") +
              (angleAdjust ? ` rotate(${angleAdjust})` : "")
            }
            fill={
              isPart ? "purple" : Color(colorToUse).isDark() ? "white" : "black"
            }
            dy={-2}
          >
            <textPath
              text-anchor="middle"
              startOffset="50%"
              xlinkHref={`#${pathId}`}
            >
              {ellipsizedName}
            </textPath>
          </text>
        </>
      )}
    </>
  );
}
