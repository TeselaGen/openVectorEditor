import React from "react";
import { startsWith } from "lodash";
import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function CircularPart({
  radius,
  arrowheadLength = 0.5,
  annotationHeight,
  totalAngle,
  color,
  ...rest
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
      {...rest}
      className="vePart veCircularViewPart"
      strokeWidth="0.5"
      stroke={colorToUse}
      fill={colorToUse}
      fillOpacity={0}
      d={path.print()}
    />
  );
}
