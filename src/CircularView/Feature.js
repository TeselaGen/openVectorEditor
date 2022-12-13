import { startsWith } from "lodash";
import React from "react";

import drawDirectedPiePiece from "./drawDirectedPiePiece";
import { getInternalLabel } from "./getInternalLabel";
import shouldFlipText from "./shouldFlipText";

export default function Feature(props) {
  const {
    color = "orange",
    radius,
    containsLocations,
    arrowheadLength = 0.5,
    annotationHeight,
    className,
    ellipsizedName,
    annotationType,
    arrowheadType,
    overlapsSelf,
    rotationRadians,
    centerAngle,
    totalAngle
  } = props;
  const isPart = annotationType === "part";
  let colorToUse = color;
  if (isPart) {
    colorToUse = startsWith(color, "override_")
      ? color.replace("override_", "")
      : "#ac68cc";
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
    arrowheadType,
    hasLabel: ellipsizedName,
    labelNeedsFlip,
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });

  return (
    <>
      <path
        className={className}
        strokeWidth=".5"
        stroke={isPart ? colorToUse : "black"}
        fill={isPart ? undefined : colorToUse}
        d={path.print()}
      />
      {getInternalLabel({ ...props, colorToUse, textPath, isPart })}
    </>
  );
}
