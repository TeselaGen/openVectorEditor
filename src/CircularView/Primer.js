import React from "react";
import drawDirectedPiePiece from "./drawDirectedPiePiece";
import { cleanRest } from "./utils/cleanRest";

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
      {...cleanRest(rest)}
      className="vePrimer veCircularViewPrimer"
      strokeWidth=".5"
      stroke="black"
      fill={color}
      d={path.print()}
    />
  );
}
