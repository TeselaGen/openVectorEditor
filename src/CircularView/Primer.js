import React from "react";
import drawDirectedPiePiece from "./drawDirectedPiePiece";

export default function CircularPrimer({
  color = "orange",
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
      className="vePrimer veCircularViewPrimer"
      strokeWidth=".5"
      stroke={"black"}
      fill={color}
      d={path.print()}
    />
  );
}
