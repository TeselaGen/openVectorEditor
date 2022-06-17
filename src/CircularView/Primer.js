import React from "react";
import { getStripedPattern } from "../utils/editorUtils";
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
  const path = drawDirectedPiePiece({
    radius,
    annotationHeight,
    totalAngle,
    arrowheadLength,
    tailThickness: 1 //feature specific
  });
  return (
    <React.Fragment>
      {getStripedPattern({ color })}
      <path
        {...cleanRest(rest)}
        className="vePrimer veCircularViewPrimer"
        strokeWidth=".5"
        stroke="black"
        fill="url(#diagonalHatch)"
        d={path.print()}
      />
    </React.Fragment>
  );
}
