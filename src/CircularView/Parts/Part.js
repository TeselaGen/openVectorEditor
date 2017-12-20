import React from "react";
import drawDirectedPiePiece from "../drawDirectedPiePiece";

export default function CircularPart({
  color = "purple",
  radius,
  arrowheadLength = 0.5,
  annotationHeight,
  totalAngle,
  ...rest
}) {
  let path = drawDirectedPiePiece({
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });
  return (
    <path
      {...rest}
      className="vePart veCircularViewPart"
      strokeWidth="0.5"
      stroke={color}
      fill={color}
      fillOpacity={0}
      d={path.print()}
    />
  );
}
