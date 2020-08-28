import React from "react";
import { startsWith } from "lodash";
import classnames from "classnames";
import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function Part({
  radius,
  arrowheadLength = 0.5,
  annotationHeight,
  totalAngle,
  color,
  className
}) {
  let path = drawDirectedPiePiece({
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });
  const colorToUse = startsWith(color, "override_")
    ? color.replace("override_", "")
    : "purple";
  return (
    <path
      className={classnames("vePart veCircularViewPart", className)}
      strokeWidth="0.5"
      stroke={colorToUse}
      fill={colorToUse}
      fillOpacity={0}
      d={path.print()}
    />
  );
}
