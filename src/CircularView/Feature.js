import React from "react";
import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function Feature({
  color = "orange",
  radius,
  containsLocations,
  arrowheadLength,
  annotationHeight,
  strokeColor,
  tailThickness=1,
  totalAngle,
  ...rest
}) {
  return (
    <path
      className="veFeature veCircularViewFeature"
      strokeWidth=".5"
      stroke={strokeColor || "black"}
      fill={color}
      d={drawDirectedPiePiece({
        radius,
        annotationHeight: containsLocations
          ? annotationHeight / 8
          : annotationHeight,
        totalAngle,
        arrowheadLength:
          arrowheadLength !== undefined ? arrowheadLength : 80 / radius,
        tailThickness,
      }).print()}
      {...rest}
    />
  );
}
