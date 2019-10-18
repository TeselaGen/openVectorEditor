import React from "react";
import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function Feature({
  color = "orange",
  radius,
  containsLocations,
  arrowheadLength,
  annotationHeight,
  totalAngle,
  ...rest
}) {
  let path = drawDirectedPiePiece({
    radius,
    annotationHeight: containsLocations
      ? annotationHeight / 8
      : annotationHeight,
    totalAngle,
    arrowheadLength:
      arrowheadLength !== undefined ? arrowheadLength : 80 / radius,
    tailThickness: 1 //feature specific
  });
  return (
    <path
      className="veFeature veCircularViewFeature"
      strokeWidth=".5"
      stroke="black"
      fill={color}
      d={path.print()}
      {...rest}
    />
  );
}
