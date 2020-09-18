import React from "react";
import drawDirectedPiePiece from "./drawDirectedPiePiece";
import { cleanRest } from "./utils/cleanRest";

export default function CircularPrimer({
  color = "orange",
  radius,
  annotationHeight,
  totalAngle,
  ...rest
}) {
  return (
    <path
      className="veOrf"
      strokeWidth=".5"
      stroke={color}
      fill={color}
      d={drawDirectedPiePiece({
        radius,
        annotationHeight,
        totalAngle,
        arrowheadLength: 0.4,
        tailThickness: 0.4
      }).print()}
      {...cleanRest(rest)}
    />
  );
}
